// server/src/utils/generateRefreshToken.js

import jwt from "jsonwebtoken";

/**
 * Generates a JWT refresh token for authenticated users
 * Refresh tokens are long-lived (7 days) and used to obtain new access tokens
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} - JWT refresh token
 */
const generateRefreshToken = (userId) => {
  if (!userId) {
    throw new Error("User ID is required for refresh token generation");
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
  }

  const payload = {
    id: userId,
  };

  const options = {
    expiresIn: "7d", // 7 days
    issuer: process.env.JWT_ISSUER || "auth-lab",
    audience: process.env.JWT_AUDIENCE || "auth-lab-users",
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options);
};

export default generateRefreshToken;
