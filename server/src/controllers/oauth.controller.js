// server/src/controllers/oauth.controller.js

import passport from "passport";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import Session from "../models/session.model.js";
import AuditLog from "../models/auditLog.model.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import emailService from "../services/email.service.js";

/**
 * OAuth Controller - Handles OAuth authentication
 * Also includes 2FA and OTP functionality
 */
class OAuthController {
  /**
   * Initiate Google OAuth
   * @route GET /api/v1/auth/google
   */
  googleAuth = (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })(req, res, next);
  };

  /**
   * Google OAuth Callback
   * @route GET /api/v1/auth/google/callback
   */
  googleCallback = (req, res, next) => {
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    }, async (err, user) => {
      if (err || !user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
      }

      try {
        const accessToken = generateAccessToken(user._id, user.email, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        await Session.create({
          userId: user._id,
          refreshToken: refreshToken,
          deviceInfo: {
            userAgent: req.get("user-agent") || "Unknown",
            ipAddress: req.ip || req.connection.remoteAddress,
            deviceType: "Desktop",
            browser: "OAuth",
            os: "OAuth",
          },
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await AuditLog.create({
          userId: user._id,
          action: "LOGIN",
          details: { provider: "google" },
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
          status: "SUCCESS",
        });

        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
        };

        res.cookie("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      } catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
      }
    })(req, res, next);
  };

  /**
   * Initiate GitHub OAuth
   * @route GET /api/v1/auth/github
   */
  githubAuth = (req, res, next) => {
    passport.authenticate("github", {
      scope: ["user:email"],
      session: false,
    })(req, res, next);
  };

  /**
   * GitHub OAuth Callback
   * @route GET /api/v1/auth/github/callback
   */
  githubCallback = (req, res, next) => {
    passport.authenticate("github", {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    }, async (err, user) => {
      if (err || !user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
      }

      try {
        const accessToken = generateAccessToken(user._id, user.email, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        await Session.create({
          userId: user._id,
          refreshToken: refreshToken,
          deviceInfo: {
            userAgent: req.get("user-agent") || "Unknown",
            ipAddress: req.ip || req.connection.remoteAddress,
            deviceType: "Desktop",
            browser: "OAuth",
            os: "OAuth",
          },
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await AuditLog.create({
          userId: user._id,
          action: "LOGIN",
          details: { provider: "github" },
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
          status: "SUCCESS",
        });

        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
        };

        res.cookie("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      } catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
      }
    })(req, res, next);
  };

  /**
   * Setup Two-Factor Authentication
   * @route POST /api/v1/auth/2fa/setup
   */
  setup2FA = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `AuthLab:${user.email}`,
        length: 20,
        issuer: "AuthLab",
      });

      // ✅ Generate QR code with proper options
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2563eb',
          light: '#ffffff',
        },
      });

      const setupToken = jwt.sign(
        {
          userId: user._id.toString(),
          secret: secret.base32,
          purpose: "2fa_setup",
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      return res.status(200).json(
        new ApiResponse(200, {
          secret: secret.base32,
          qrCode: qrCodeUrl,
          otpauthUrl: secret.otpauth_url,
          setupToken,
        })
      );
    } catch (error) {
      console.error("2FA Setup Error:", error);
      throw new ApiError(500, "Failed to generate 2FA QR code: " + error.message);
    }
  });

  /**
   * Verify and enable Two-Factor Authentication
   * @route POST /api/v1/auth/2fa/verify
   */
  verify2FA = asyncHandler(async (req, res) => {
    const { token, setupToken } = req.body;
    const userId = req.user.id;

    if (!token) {
      throw new ApiError(400, "2FA token is required");
    }

    if (!setupToken) {
      throw new ApiError(400, "2FA setup token is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let decodedSetup;
    try {
      decodedSetup = jwt.verify(setupToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(400, "2FA setup has expired. Please start again.");
    }

    if (
      decodedSetup.purpose !== "2fa_setup" ||
      decodedSetup.userId !== userId.toString() ||
      !decodedSetup.secret
    ) {
      throw new ApiError(400, "Invalid 2FA setup token");
    }

    const verified = speakeasy.totp.verify({
      secret: decodedSetup.secret,
      encoding: "base32",
      token: token,
      window: 1,
    });

    if (!verified) {
      throw new ApiError(400, "Invalid 2FA token");
    }

    user.twoFactorSecret = decodedSetup.secret;
    user.isTwoFactorEnabled = true;
    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      userId: user._id,
      action: "PROFILE_UPDATE",
      details: { action: "2FA_ENABLED" },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
    });

    return res.status(200).json(
      new ApiResponse(200, null, "2FA enabled successfully")
    );
  });

  /**
   * Disable Two-Factor Authentication
   * @route POST /api/v1/auth/2fa/disable
   */
  disable2FA = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      throw new ApiError(400, "2FA token is required");
    }

    const user = await User.findById(userId).select("+twoFactorSecret");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new ApiError(400, "2FA is not enabled");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 1,
    });

    if (!verified) {
      throw new ApiError(400, "Invalid 2FA token");
    }

    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save({ validateBeforeSave: false });

    await AuditLog.create({
      userId: user._id,
      action: "PROFILE_UPDATE",
      details: { action: "2FA_DISABLED" },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      status: "SUCCESS",
    });

    return res.status(200).json(
      new ApiResponse(200, null, "2FA disabled successfully")
    );
  });

  /**
   * Verify 2FA token during login
   * @route POST /api/v1/auth/2fa/verify-login
   */
  verify2FALogin = asyncHandler(async (req, res) => {
    const { token, tempAccessToken } = req.body;

    if (!token || !tempAccessToken) {
      throw new ApiError(400, "Token and temp access token are required");
    }

    let decoded;
    try {
      decoded = jwt.verify(tempAccessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired session");
    }

    const user = await User.findById(decoded.id).select("+twoFactorSecret");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new ApiError(400, "2FA is not enabled for this user");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 1,
    });

    if (!verified) {
      throw new ApiError(400, "Invalid 2FA token");
    }

    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    await Session.create({
      userId: user._id,
      refreshToken: refreshToken,
      deviceInfo: {
        userAgent: req.get("user-agent") || "Unknown",
        ipAddress: req.ip || req.connection.remoteAddress,
        deviceType: "Desktop",
        browser: "Unknown",
        os: "Unknown",
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        accessToken,
        user: user.toPublicJSON(),
      })
    );
  });

  /**
   * Send OTP for verification
   * @route POST /api/v1/auth/otp/send
   */
  sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save({ validateBeforeSave: false });

    await emailService.sendOTPEmail({
      email: user.email,
      name: user.name,
      otp: otp,
    });

    return res.status(200).json(
      new ApiResponse(200, null, "OTP sent successfully")
    );
  });

  /**
   * Verify OTP
   * @route POST /api/v1/auth/otp/verify
   */
  verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.otp || !user.otpExpiry) {
      throw new ApiError(400, "OTP not requested");
    }

    if (Date.now() > user.otpExpiry.getTime()) {
      throw new ApiError(400, "OTP has expired");
    }

    if (user.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(200, {
        email: user.email,
        message: "OTP verified successfully",
      })
    );
  });
}

export default new OAuthController();
