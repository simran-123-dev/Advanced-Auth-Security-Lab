// server/src/models/user.model.js

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

/**
 * User Schema for Advanced Auth & Security Lab
 * Includes email verification, password reset, and profile features
 */
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // User's email address - unique identifier
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    // Hashed password using bcrypt
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // Avatar fields
    avatar: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
      select: false,
    },

    // Profile fields - REMOVED geospatial index from location
    bio: {
      type: String,
      maxlength: [200, "Bio cannot exceed 200 characters"],
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: "",
      // Remove any index: '2dsphere' or index: true from here
    },
    website: {
      type: String,
      default: "",
    },

    // OAuth
    oauthProvider: {
      type: String,
      enum: ["google", "github", null],
      default: null,
    },
    oauthId: {
      type: String,
      default: null,
    },

    // Two-Factor Authentication
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },

    // OTP
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },

    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },

    // Password reset fields
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      select: false,
    },

    // Last password change timestamp for security
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },

    // Refresh token for JWT rotation
    refreshToken: {
      type: String,
      select: false,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // User role for authorization
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ✅ CORRECTED: Pre-save middleware to hash password before saving
 * Using async/await WITHOUT the next() callback parameter
 */
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    this.lastPasswordChange = new Date();
    this.resetPasswordToken = undefined;
    this.resetPasswordTokenExpiry = undefined;
  } catch (error) {
    throw error;
  }
});

/**
 * Instance method to compare password with hashed password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

/**
 * Instance method to check if verification token is expired
 */
userSchema.methods.isVerificationTokenExpired = function () {
  if (!this.verificationTokenExpiry) return true;
  return Date.now() > this.verificationTokenExpiry.getTime();
};

/**
 * Instance method to check if reset token is expired
 */
userSchema.methods.isResetTokenExpired = function () {
  if (!this.resetPasswordTokenExpiry) return true;
  return Date.now() > this.resetPasswordTokenExpiry.getTime();
};

/**
 * Instance method to clear sensitive tokens before sending user data
 */
userSchema.methods.toPublicJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.verificationTokenExpiry;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordTokenExpiry;
  delete userObject.refreshToken;
  delete userObject.avatarPublicId;
  delete userObject.twoFactorSecret;
  delete userObject.otp;
  delete userObject.otpExpiry;
  delete userObject.__v;
  return userObject;
};

// Create and export User model
const User = mongoose.model("User", userSchema);

export default User;