// server/src/routes/auth.routes.js

import express from "express";
import authController from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  resendVerificationSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

/**
 * Authentication Routes
 * All routes are prefixed with /api/v1/auth
 * Following REST API best practices
 */

router.get("/check", authController.checkAuth);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { name, email, password }
 * @returns { user, message }
 */
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 * @returns { user, accessToken }
 */
router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 * @returns { message }
 */
router.post(
  "/logout",
  authController.logout
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (requires refresh token in cookies)
 * @returns { accessToken }
 */
router.post(
  "/refresh-token",
  authController.refreshToken
);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 * @params  { token }
 * @returns { message }
 */
router.get(
  "/verify-email/:token",
  authController.verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 * @body    { email }
 * @returns { message }
 */
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  authController.resendVerification
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset link
 * @access  Public
 * @body    { email }
 * @returns { message }
 */
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 * @params  { token }
 * @body    { password, confirmPassword }
 * @returns { message }
 */
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password (authenticated user)
 * @access  Private
 * @body    { currentPassword, newPassword, confirmNewPassword }
 * @returns { message }
 */
router.post(
  "/change-password",
  verifyJWT,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
