// server/src/controllers/admin.controller.js

import User from "../models/user.model.js";
import AdminActivity from "../models/admin.model.js";
import AuditLog from "../models/auditLog.model.js";
import Session from "../models/session.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

/**
 * Admin Controller - Handles all administrative operations
 * All methods require admin role
 */
class AdminController {
  /**
   * Get admin dashboard statistics
   * @route GET /api/v1/admin/dashboard
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const adminUsers = await User.countDocuments({ role: "admin" });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrations = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // Get recent admin activities
    const recentActivities = await AdminActivity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("adminId", "name email")
      .populate("targetUserId", "name email");

    // Get audit log count
    const totalAuditLogs = await AuditLog.countDocuments();

    return res.status(200).json(
      new ApiResponse(200, {
        stats: {
          totalUsers,
          activeUsers,
          verifiedUsers,
          adminUsers,
          recentRegistrations,
          todayRegistrations,
          totalAuditLogs,
        },
        recentActivities,
      })
    );
  });

  /**
   * Get all users with pagination and filters
   * @route GET /api/v1/admin/users
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, role, isActive, isEmailVerified, sortBy, sortOrder } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isEmailVerified !== undefined) filter.isEmailVerified = isEmailVerified === "true";

    // Sort options
    const sort = {};
    sort[sortBy || "createdAt"] = sortOrder === "asc" ? 1 : -1;

    const users = await User.find(filter)
      .select("-password -refreshToken -verificationToken -resetPasswordToken")
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await User.countDocuments(filter);

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

  /**
   * Ban a user
   * @route PUT /api/v1/admin/users/:id/ban
   */
  banUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role === "admin") {
      throw new ApiError(403, "Cannot ban an admin user");
    }

    if (!user.isActive) {
      throw new ApiError(400, "User is already banned");
    }

    // Update user
    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    // Terminate all user sessions
    await Session.updateMany(
      { userId: user._id, isActive: true },
      { isActive: false }
    );

    // Log admin activity
    await AdminActivity.create({
      adminId,
      action: "USER_BAN",
      targetUserId: user._id,
      details: { reason: reason || "No reason provided" },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
        message: `User ${user.email} has been banned successfully`,
      })
    );
  });

  /**
   * Unban a user
   * @route PUT /api/v1/admin/users/:id/unban
   */
  unbanUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isActive) {
      throw new ApiError(400, "User is not banned");
    }

    // Update user
    user.isActive = true;
    await user.save({ validateBeforeSave: false });

    // Log admin activity
    await AdminActivity.create({
      adminId,
      action: "USER_UNBAN",
      targetUserId: user._id,
      details: { message: "User unbanned" },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
        message: `User ${user.email} has been unbanned successfully`,
      })
    );
  });

  /**
   * Delete a user (permanently)
   * @route DELETE /api/v1/admin/users/:id
   */
  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role === "admin") {
      throw new ApiError(403, "Cannot delete an admin user");
    }

    // Get user email for response
    const userEmail = user.email;

    // Delete user
    await User.findByIdAndDelete(id);

    // Delete all sessions
    await Session.deleteMany({ userId: id });

    // Log admin activity
    await AdminActivity.create({
      adminId,
      action: "USER_DELETE",
      targetUserId: id,
      details: { email: userEmail },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json(
      new ApiResponse(200, null, `User ${userEmail} has been deleted successfully`)
    );
  });

  /**
   * Change user role
   * @route PUT /api/v1/admin/users/:id/role
   */
  changeUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.user.id;

    if (!role || !["user", "admin"].includes(role)) {
      throw new ApiError(400, "Invalid role. Must be 'user' or 'admin'");
    }

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Prevent admin from changing own role
    if (user._id.toString() === adminId) {
      throw new ApiError(403, "Cannot change your own role");
    }

    user.role = role;
    await user.save({ validateBeforeSave: false });

    // Log admin activity
    await AdminActivity.create({
      adminId,
      action: "USER_ROLE_CHANGE",
      targetUserId: user._id,
      details: { newRole: role, oldRole: user.role },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
        message: `User role changed to ${role} successfully`,
      })
    );
  });

  /**
   * Get audit logs with filters
   * @route GET /api/v1/admin/audit-logs
   */
  getAuditLogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const { userId, action, status, fromDate, toDate } = req.query;

    // Build filter
    const filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const logs = await AuditLog.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(200, {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  });

  /**
   * Get user sessions
   * @route GET /api/v1/admin/users/:id/sessions
   */
  getUserSessions = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const sessions = await Session.find({ userId: id, isActive: true })
      .select("-refreshToken")
      .sort({ lastActivity: -1 });

    return res.status(200).json(
      new ApiResponse(200, {
        user: user.toPublicJSON(),
        sessions,
        totalActiveSessions: sessions.length,
      })
    );
  });

  /**
   * Terminate user session
   * @route DELETE /api/v1/admin/users/:userId/sessions/:sessionId
   */
  terminateUserSession = asyncHandler(async (req, res) => {
    const { userId, sessionId } = req.params;
    const adminId = req.user.id;

    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    session.isActive = false;
    await session.save();

    // Log admin activity
    await AdminActivity.create({
      adminId,
      action: "ADMIN_ACCESS",
      targetUserId: userId,
      details: { action: "SESSION_TERMINATE", sessionId },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json(
      new ApiResponse(200, null, "Session terminated successfully")
    );
  });

  /**
   * Get system statistics (admin only)
   * @route GET /api/v1/admin/stats
   */
  getSystemStats = asyncHandler(async (req, res) => {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Session statistics
    const totalSessions = await Session.countDocuments({ isActive: true });

    // Audit statistics
    const totalAuditLogs = await AuditLog.countDocuments();
    const todayLogs = await AuditLog.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    // Activity statistics (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const loginLogs = await AuditLog.countDocuments({
      action: "LOGIN",
      createdAt: { $gte: last24Hours },
    });

    return res.status(200).json(
      new ApiResponse(200, {
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          inactive: totalUsers - activeUsers,
        },
        sessions: {
          active: totalSessions,
        },
        audit: {
          total: totalAuditLogs,
          today: todayLogs,
          last24Hours: loginLogs,
        },
        timestamp: new Date().toISOString(),
      })
    );
  });
}

export default new AdminController();