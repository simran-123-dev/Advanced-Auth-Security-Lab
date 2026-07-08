// server/src/models/auditLog.model.js

import mongoose from "mongoose";

/**
 * Audit Log Schema
 * Tracks all system-wide activities for security and compliance
 */
const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "LOGIN_FAILED",
        "PASSWORD_CHANGE",
        "PASSWORD_RESET",
        "EMAIL_VERIFY",
        "PROFILE_UPDATE",
        "AVATAR_UPLOAD",
        "AVATAR_REMOVE",
        "SESSION_CREATE",
        "SESSION_TERMINATE",
        "ADMIN_ACTION",
        "API_ACCESS",
        "REFRESH_TOKEN",
        "ACCOUNT_LOCK",
        "ACCOUNT_UNLOCK",
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
    errorMessage: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: 1 });
auditLogSchema.index({ ipAddress: 1 });

// Instance method to format log for response
auditLogSchema.methods.toPublicJSON = function () {
  const log = this.toObject();
  delete log.__v;
  return log;
};

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;