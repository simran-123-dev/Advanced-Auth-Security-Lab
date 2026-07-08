// server/src/middleware/audit.middleware.js

import AuditLog from "../models/auditLog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Audit Log Middleware
 * Logs all API requests and actions
 */
const auditLog = (action) => {
  return asyncHandler(async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    let responseData = null;

    // Override send to capture response
    res.send = function (data) {
      responseData = data;
      return originalSend.call(this, data);
    };

    // Continue to route handler
    await next();

    // Log the action after response is sent
    try {
      const userId = req.user?._id || req.user?.id || null;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("user-agent");

      // Determine status from response
      const status = res.statusCode < 400 ? "SUCCESS" : "FAILED";

      // Create audit log
      const logData = {
        userId: userId,
        action: action,
        details: {
          method: req.method,
          path: req.path,
          query: req.query,
          body: req.method !== "GET" ? req.body : undefined,
          responseStatus: res.statusCode,
        },
        ipAddress: ipAddress,
        userAgent: userAgent,
        status: status,
        metadata: {
          timestamp: new Date(),
          requestId: req.headers["x-request-id"],
        },
      };

      // Don't log sensitive data
      if (logData.details.body) {
        delete logData.details.body.password;
        delete logData.details.body.confirmPassword;
        delete logData.details.body.currentPassword;
        delete logData.details.body.newPassword;
      }

      await AuditLog.create(logData);
    } catch (error) {
      // Don't let audit logging fail the request
      console.error("Audit log error:", error.message);
    }
  });
};

/**
 * Log specific actions
 */
const logLogin = auditLog("LOGIN");
const logLogout = auditLog("LOGOUT");
const logPasswordChange = auditLog("PASSWORD_CHANGE");
const logProfileUpdate = auditLog("PROFILE_UPDATE");
const logAvatarUpload = auditLog("AVATAR_UPLOAD");
const logAdminAction = auditLog("ADMIN_ACTION");

export {
  auditLog,
  logLogin,
  logLogout,
  logPasswordChange,
  logProfileUpdate,
  logAvatarUpload,
  logAdminAction,
};