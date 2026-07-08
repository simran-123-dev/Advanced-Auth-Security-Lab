// server/src/models/admin.model.js

import mongoose from "mongoose";

/**
 * Admin Activity Log Schema
 * Tracks all admin actions for audit purposes
 */
const adminActivitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "USER_BAN",
        "USER_UNBAN",
        "USER_DELETE",
        "USER_ROLE_CHANGE",
        "ADMIN_ACCESS",
        "SETTINGS_UPDATE",
        "LOG_VIEW",
        "REPORT_VIEW",
      ],
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
adminActivitySchema.index({ adminId: 1, createdAt: -1 });
adminActivitySchema.index({ action: 1 });
adminActivitySchema.index({ createdAt: 1 });

const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);

export default AdminActivity;