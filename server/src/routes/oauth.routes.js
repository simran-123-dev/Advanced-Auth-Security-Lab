// server/src/routes/oauth.routes.js

import express from "express";
import passport from "passport";
import oauthController from "../controllers/oauth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { otpSchema, twoFaVerifySchema } from "../validators/oauth.validator.js";

const router = express.Router();

/**
 * OAuth Routes
 * All routes are prefixed with /api/v1/auth
 */

// Google OAuth
router.get("/google", oauthController.googleAuth);
router.get("/google/callback", oauthController.googleCallback);

// GitHub OAuth
router.get("/github", oauthController.githubAuth);
router.get("/github/callback", oauthController.githubCallback);

// Two-Factor Authentication
router.post("/2fa/setup", verifyJWT, oauthController.setup2FA);
router.post("/2fa/verify", verifyJWT, validate(twoFaVerifySchema), oauthController.verify2FA);
router.post("/2fa/disable", verifyJWT, validate(twoFaVerifySchema), oauthController.disable2FA);
router.post("/2fa/verify-login", validate(twoFaVerifySchema), oauthController.verify2FALogin);

// OTP Verification
router.post("/otp/send", validate(otpSchema), oauthController.sendOTP);
router.post("/otp/verify", validate(otpSchema), oauthController.verifyOTP);

export default router;