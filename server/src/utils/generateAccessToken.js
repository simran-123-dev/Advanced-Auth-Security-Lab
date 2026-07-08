// server/src/utils/generateAccessToken.js

import jwt from "jsonwebtoken";

/**
 * Generates a JWT access token for authenticated users
 * Access tokens are short-lived (15 minutes) for security
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} email - User's email address
 * @param {string} role - User's role (user/admin)
 * @returns {string} - JWT access token
 */
const generateAccessToken = (userId, email, role) => {
  if (!userId || !email || !role) {
    throw new Error("Missing required parameters for access token generation");
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
  }

  const payload = {
    id: userId,
    email: email,
    role: role,
  };

  const options = {
    expiresIn: "15m", // 15 minutes
    issuer: process.env.JWT_ISSUER || "auth-lab",
    audience: process.env.JWT_AUDIENCE || "auth-lab-users",
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};

export default generateAccessToken;