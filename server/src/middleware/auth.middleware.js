// server/src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

/**
 * Middleware to verify JWT access token
 * Extracts token from cookies or Authorization header
 * Attaches user object to request if valid
 */
const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access - No token provided");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by id from token
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid access token - User not found");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Invalid access token"));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Access token expired"));
    } else {
      next(new ApiError(401, error.message || "Authentication failed"));
    }
  }
};

export { verifyJWT };