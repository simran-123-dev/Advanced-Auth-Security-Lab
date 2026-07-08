// server/src/controllers/user.controller.js

import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * User Controller - Handles all user profile operations
 * Follows Clean Architecture principles
 */
class UserController {
  /**
   * Get current user profile
   * @route GET /api/v1/users/me
   */
  getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
      })
    );
  });

  /**
   * Get user profile by ID (admin only)
   * @route GET /api/v1/users/:id
   */
  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if requesting user has permission (admin or own profile)
    if (req.user.role !== "admin" && req.user.id !== id) {
      throw new ApiError(403, "You don't have permission to view this profile");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
      })
    );
  });

  /**
   * Update user profile
   * @route PUT /api/v1/users/update-profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const { name, email, bio, phone, location, website } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(409, "Email already in use by another account");
      }
      user.email = email;
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    await user.save({ validateBeforeSave: true });

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
        message: "Profile updated successfully",
      })
    );
  });

  /**
   * Upload avatar image using Cloudinary
   * @route POST /api/v1/users/upload-avatar
   */
  uploadAvatar = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Check if file was uploaded
    if (!req.file) {
      throw new ApiError(400, "No image file provided");
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      throw new ApiError(400, "Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.");
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      fs.unlinkSync(req.file.path);
      throw new ApiError(400, "File too large. Maximum size is 5MB.");
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "auth-lab/avatars",
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
        fetch_format: "auto",
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "face" }
        ]
      });

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      // Find user and update avatar
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Delete old avatar from Cloudinary if exists
      if (user.avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(user.avatarPublicId);
        } catch (error) {
          console.error("Error deleting old avatar:", error.message);
        }
      }

      // Update user with new avatar
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json(
        new ApiResponse(200, {
          user: user.toPublicJSON(),
          avatar: result.secure_url,
          message: "Avatar uploaded successfully",
        })
      );
    } catch (error) {
      // Clean up file if upload fails
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      throw new ApiError(500, "Failed to upload avatar: " + error.message);
    }
  });

  /**
   * Remove avatar
   * @route DELETE /api/v1/users/remove-avatar
   */
  removeAvatar = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete avatar from Cloudinary
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (error) {
        console.error("Error deleting avatar:", error.message);
      }
    }

    // Reset avatar fields
    user.avatar = null;
    user.avatarPublicId = null;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
        message: "Avatar removed successfully",
      })
    );
  });

  /**
   * Change password (authenticated user)
   * @route POST /api/v1/users/change-password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new ApiError(400, "All password fields are required");
    }

    if (newPassword !== confirmNewPassword) {
      throw new ApiError(400, "New passwords do not match");
    }

    // Find user with password field
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    // Clear refresh token to force re-login
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(200, null, "Password changed successfully")
    );
  });

  /**
   * Get all users (admin only)
   * @route GET /api/v1/users
   */
  getAllUsers = asyncHandler(async (req, res) => {
    // Admin only
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return res.status(200).json(
      new ApiResponse(200, {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  });
}

export default new UserController();