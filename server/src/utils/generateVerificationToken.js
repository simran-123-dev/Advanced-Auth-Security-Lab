// server/src/utils/generateVerificationToken.js

import crypto from "crypto";

/**
 * Generates a cryptographically secure verification token
 * Uses Node.js crypto.randomBytes for production-grade randomness
 * @returns {string} - 64 character hex string (32 bytes)
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default generateVerificationToken;