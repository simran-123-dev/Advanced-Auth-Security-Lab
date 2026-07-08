// server/src/controllers/auth.controller.js

import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import emailService from "../services/email.service.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/session.model.js";
import AuditLog from "../models/auditLog.model.js";

/**
 * Auth Controller - Handles all authentication operations
 * Follows Clean Architecture principles - no HTML, no business logic in routes
 */
class AuthController {
  /**
   * Check current auth state without returning a 401 for logged-out visitors.
   * @route GET /api/v1/auth/check
   */
  checkAuth = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(200).json(
        new ApiResponse(200, {
          user: null,
          isAuthenticated: false,
        })
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json(
          new ApiResponse(200, {
            user: null,
            isAuthenticated: false,
          })
        );
      }

      return res.status(200).json(
        new ApiResponse(200, {
          user: user.toPublicJSON(),
          isAuthenticated: true,
        })
      );
    } catch (error) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(200).json(
        new ApiResponse(200, {
          user: null,
          isAuthenticated: false,
        })
      );
    }
  });

  /**
   * Register a new user
   * @route POST /api/v1/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry,
    });

    // Get base URL from request
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Send verification email
    await emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
      baseUrl,
    });

    const userResponse = user.toPublicJSON();

    return res.status(201).json(
      new ApiResponse(201, {
        user: userResponse,
        message: "User registered successfully. Please verify your email.",
      }),
    );
  });

  /**
   * Login user
   * @route POST /api/v1/auth/login
   */
  /**
   * Login user
   * @route POST /api/v1/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      await AuditLog.create({
        userId: null,
        action: "LOGIN_FAILED",
        details: { email },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        status: "FAILED",
        errorMessage: "Invalid email or password",
      });
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        details: { email },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        status: "FAILED",
        errorMessage: "Account is deactivated",
      });
      throw new ApiError(
        403,
        "Account is deactivated. Please contact support.",
      );
    }

    if (!user.isEmailVerified) {
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        details: { email },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        status: "FAILED",
        errorMessage: "Email not verified",
      });
      throw new ApiError(
        403,
        "Email not verified. Please verify your email first.",
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        details: { email },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        status: "FAILED",
        errorMessage: "Invalid password",
      });
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.isTwoFactorEnabled) {
      const tempAccessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role, purpose: "2fa" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      return res.status(200).json(
        new ApiResponse(200, {
          requires2FA: true,
          tempAccessToken,
        })
      );
    }

    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // ✅ FIXED: Removed location: {} from session
    const session = await Session.create({
      userId: user._id,
      refreshToken: refreshToken,
      deviceInfo: {
        userAgent: req.get("user-agent") || "Unknown",
        ipAddress: req.ip || req.connection.remoteAddress,
        deviceType: this._detectDeviceType(req.get("user-agent")),
        browser: this._detectBrowser(req.get("user-agent")),
        os: this._detectOS(req.get("user-agent")),
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await AuditLog.create({
      userId: user._id,
      action: "LOGIN",
      details: {
        email: user.email,
        sessionId: session._id,
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
    });

    const userResponse = user.toPublicJSON();

    return res.status(200).json(
      new ApiResponse(200, {
        user: userResponse,
        accessToken,
        session: {
          id: session._id,
          expiresAt: session.expiresAt,
        },
      }),
    );
  });
  /**
   * Logout user
   * @route POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await Session.findOneAndUpdate(
        { refreshToken, isActive: true },
        { isActive: false },
      );

      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } },
      );
    }

    if (req.user) {
      await AuditLog.create({
        userId: req.user.id,
        action: "LOGOUT",
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        status: "SUCCESS",
      });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logged out successfully"));
  });

  /**
   * Refresh access token
   * @route POST /api/v1/auth/refresh-token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token required");
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: refreshToken,
    });

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    await Session.findOneAndUpdate(
      { refreshToken, isActive: true },
      { lastActivity: new Date() },
    );

    const newAccessToken = generateAccessToken(user._id, user.email, user.role);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        accessToken: newAccessToken,
      }),
    );
  });

  /**
   * Verify email with token
   * @route GET /api/v1/auth/verify-email/:token
   */
  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, "Verification token is required");
    }

    const user = await User.findOne({
      verificationToken: token,
    }).select("+verificationToken +verificationTokenExpiry");

    if (!user) {
      throw new ApiError(400, "Invalid or expired verification token");
    }

    if (user.isVerificationTokenExpired()) {
      throw new ApiError(400, "Verification token has expired");
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      userId: user._id,
      action: "EMAIL_VERIFY",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
    });

    await emailService.sendWelcomeEmail({
      email: user.email,
      name: user.name,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        email: user.email,
        message: "Email verified successfully",
      }),
    );
  });

  /**
   * Resend verification email
   * @route POST /api/v1/auth/resend-verification
   */
  resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, "Email already verified");
    }

    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save({ validateBeforeSave: false });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    await emailService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
      baseUrl,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Verification email sent successfully"));
  });

  /**
   * Forgot password - send reset link
   * @route POST /api/v1/auth/forgot-password
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save({ validateBeforeSave: false });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    await emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      token: resetToken,
      baseUrl,
    });

    await AuditLog.create({
      userId: user._id,
      action: "PASSWORD_RESET",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
      details: { email: user.email },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password reset link sent to your email"),
      );
  });

  /**
   * Reset password with token
   * @route POST /api/v1/auth/reset-password/:token
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      throw new ApiError(400, "Reset token is required");
    }

    if (!password || !confirmPassword) {
      throw new ApiError(400, "Password and confirm password are required");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    const user = await User.findOne({
      resetPasswordToken: token,
    }).select("+resetPasswordToken +resetPasswordTokenExpiry");

    if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    if (user.isResetTokenExpired()) {
      throw new ApiError(400, "Reset token has expired");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    await Session.updateMany(
      { userId: user._id, isActive: true },
      { isActive: false },
    );

    await AuditLog.create({
      userId: user._id,
      action: "PASSWORD_CHANGE",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
      details: { action: "PASSWORD_RESET_COMPLETED" },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successfully"));
  });

  /**
   * Change password (authenticated user)
   * @route POST /api/v1/auth/change-password
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

    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    await Session.updateMany(
      { userId: user._id, isActive: true },
      { isActive: false },
    );

    await AuditLog.create({
      userId: user._id,
      action: "PASSWORD_CHANGE",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  });

  /**
   * Helper: Detect device type from user agent
   * @private
   */
  _detectDeviceType(userAgent) {
    if (!userAgent) return "Other";
    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone") ||
      ua.includes("ipad")
    ) {
      return "Mobile";
    }
    if (ua.includes("tablet")) return "Tablet";
    return "Desktop";
  }

  /**
   * Helper: Detect browser from user agent
   * @private
   */
  _detectBrowser(userAgent) {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome") && !ua.includes("edge")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
    if (ua.includes("edge")) return "Edge";
    if (ua.includes("opera")) return "Opera";
    return "Other";
  }

  /**
   * Helper: Detect OS from user agent
   * @private
   */
  _detectOS(userAgent) {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("mac os") || ua.includes("macintosh")) return "MacOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("android")) return "Android";
    if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
      return "iOS";
    return "Other";
  }
}

// Export controller instance as default
export default new AuthController();
