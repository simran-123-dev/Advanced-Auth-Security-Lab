// server/src/validators/oauth.validator.js

import { z } from "zod";

/**
 * OTP validation schema
 */
const otpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

/**
 * 2FA verification schema
 */
const twoFaVerifySchema = z.object({
  token: z.string().length(6, "2FA token must be 6 digits"),
  tempAccessToken: z.string().optional(),
});

export {
  otpSchema,
  twoFaVerifySchema,
};