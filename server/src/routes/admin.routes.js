// server/src/routes/admin.routes.js

import express from "express";
import adminController from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { banUserSchema, changeRoleSchema } from "../validators/admin.validator.js";

const router = express.Router();

/**
 * Admin Routes
 * All routes are prefixed with /api/v1/admin
 * All routes require authentication and admin role
 */

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin only)
 */
router.get("/dashboard", verifyJWT, isAdmin, adminController.getDashboardStats);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with pagination
 * @access  Private (Admin only)
 */
router.get("/users", verifyJWT, isAdmin, adminController.getAllUsers);

/**
 * @route   GET /api/v1/admin/users/:id/sessions
 * @desc    Get user sessions
 * @access  Private (Admin only)
 */
router.get("/users/:id/sessions", verifyJWT, isAdmin, adminController.getUserSessions);

/**
 * @route   PUT /api/v1/admin/users/:id/ban
 * @desc    Ban a user
 * @access  Private (Admin only)
 */
router.put(
  "/users/:id/ban",
  verifyJWT,
  isAdmin,
  validate(banUserSchema),
  adminController.banUser
);

/**
 * @route   PUT /api/v1/admin/users/:id/unban
 * @desc    Unban a user
 * @access  Private (Admin only)
 */
router.put("/users/:id/unban", verifyJWT, isAdmin, adminController.unbanUser);

/**
 * @route   PUT /api/v1/admin/users/:id/role
 * @desc    Change user role
 * @access  Private (Admin only)
 */
router.put(
  "/users/:id/role",
  verifyJWT,
  isAdmin,
  validate(changeRoleSchema),
  adminController.changeUserRole
);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
router.delete("/users/:id", verifyJWT, isAdmin, adminController.deleteUser);

/**
 * @route   GET /api/v1/admin/audit-logs
 * @desc    Get audit logs with filters
 * @access  Private (Admin only)
 */
router.get("/audit-logs", verifyJWT, isAdmin, adminController.getAuditLogs);

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get system statistics
 * @access  Private (Admin only)
 */
router.get("/stats", verifyJWT, isAdmin, adminController.getSystemStats);

/**
 * @route   DELETE /api/v1/admin/users/:userId/sessions/:sessionId
 * @desc    Terminate a user session
 * @access  Private (Admin only)
 */
router.delete(
  "/users/:userId/sessions/:sessionId",
  verifyJWT,
  isAdmin,
  adminController.terminateUserSession
);

export default router;