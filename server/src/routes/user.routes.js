// server/src/routes/user.routes.js

import express from "express";
import userController from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/user.validator.js";

const router = express.Router();

/**
 * User Routes
 * All routes are prefixed with /api/v1/users
 * Following REST API best practices
 */

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", verifyJWT, userController.getCurrentUser);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get("/:id", verifyJWT, userController.getUserById);

/**
 * @route   PUT /api/v1/users/update-profile
 * @desc    Update user profile
 * @access  Private
 * @body    { name, email, bio, phone, location, website }
 */
router.put(
  "/update-profile",
  verifyJWT,
  validate(updateProfileSchema),
  userController.updateProfile
);

/**
 * @route   POST /api/v1/users/upload-avatar
 * @desc    Upload avatar image
 * @access  Private
 * @body    FormData with 'avatar' file
 */
router.post(
  "/upload-avatar",
  verifyJWT,
  upload.single("avatar"),
  userController.uploadAvatar
);

/**
 * @route   DELETE /api/v1/users/remove-avatar
 * @desc    Remove avatar
 * @access  Private
 */
router.delete(
  "/remove-avatar",
  verifyJWT,
  userController.removeAvatar
);

/**
 * @route   POST /api/v1/users/change-password
 * @desc    Change password
 * @access  Private
 * @body    { currentPassword, newPassword, confirmNewPassword }
 */
router.post(
  "/change-password",
  verifyJWT,
  validate(changePasswordSchema),
  userController.changePassword
);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get("/", verifyJWT, userController.getAllUsers);

export default router;