// server/src/models/session.model.js

import mongoose from "mongoose";

/**
 * Session Management Schema
 * Tracks user sessions and devices
 */
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      select: false,
    },
    deviceInfo: {
      userAgent: {
        type: String,
        required: true,
      },
      ipAddress: {
        type: String,
        required: true,
      },
      location: {
        city: String,
        country: String,
        region: String,
      },
      deviceType: {
        type: String,
        enum: ["Desktop", "Mobile", "Tablet", "Other"],
        default: "Other",
      },
      browser: String,
      os: String,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance method to check if session is expired
sessionSchema.methods.isExpired = function () {
  return Date.now() > this.expiresAt.getTime();
};

// Instance method to update last activity
sessionSchema.methods.updateActivity = function () {
  this.lastActivity = new Date();
  return this.save();
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;