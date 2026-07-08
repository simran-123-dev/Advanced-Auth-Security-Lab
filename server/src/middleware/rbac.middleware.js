// server/src/middleware/rbac.middleware.js

import { ApiError } from "../utils/ApiError.js";

/**
 * Role-Based Access Control Middleware
 * Checks if user has required role to access resource
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }

    // Check if user has required role
    if (!roles.includes(user.role)) {
      throw new ApiError(403, "Access denied. Insufficient permissions.");
    }

    next();
  };
};

/**
 * Check if user has admin role
 */
const isAdmin = (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  next();
};

/**
 * Check if user is the owner of the resource or admin
 */
const isOwnerOrAdmin = (req, res, next) => {
  const user = req.user;
  const resourceUserId = req.params.id || req.body.userId;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (user.role === "admin" || user.id === resourceUserId) {
    return next();
  }

  throw new ApiError(403, "Access denied. You can only access your own resources.");
};

/**
 * Check if user has specific permission
 */
const hasPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    const userPermissions = req.user.permissions || [];

    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }

    // Admin has all permissions
    if (user.role === "admin") {
      return next();
    }

    if (!userPermissions.includes(permission)) {
      throw new ApiError(403, `Permission denied: ${permission} required`);
    }

    next();
  };
};

export { checkRole, isAdmin, isOwnerOrAdmin, hasPermission };