// server/src/controllers/session.controller.js

import Session from "../models/session.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Session Controller - Handles user session management
 */
class SessionController {
  /**
   * Get all active sessions for current user
   * @route GET /api/v1/sessions
   */
  getMySessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const sessions = await Session.find({ userId, isActive: true })
      .select("-refreshToken")
      .sort({ lastActivity: -1 });

    return res.status(200).json(
      new ApiResponse(200, {
        sessions,
        total: sessions.length,
      })
    );
  });

  /**
   * Get session by ID
   * @route GET /api/v1/sessions/:id
   */
  getSessionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({ _id: id, userId })
      .select("-refreshToken");

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        session,
      })
    );
  });

  /**
   * Terminate a specific session
   * @route DELETE /api/v1/sessions/:id
   */
  terminateSession = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Don't allow terminating current session (current session uses refresh token)
    const session = await Session.findOne({ _id: id, userId });
    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    // Check if this is the current session
    const currentSession = await Session.findOne({
      userId,
      refreshToken: req.cookies?.refreshToken,
    });

    if (currentSession && currentSession._id.toString() === id) {
      throw new ApiError(400, "Cannot terminate the current session. Please logout instead.");
    }

    session.isActive = false;
    await session.save();

    return res.status(200).json(
      new ApiResponse(200, null, "Session terminated successfully")
    );
  });

  /**
   * Terminate all other sessions (keep current)
   * @route DELETE /api/v1/sessions/terminate-all
   */
  terminateAllOtherSessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Find current session
    const currentRefreshToken = req.cookies?.refreshToken;
    let currentSession = null;

    if (currentRefreshToken) {
      currentSession = await Session.findOne({
        userId,
        refreshToken: currentRefreshToken,
        isActive: true,
      });
    }

    // Terminate all other sessions
    const query = { userId, isActive: true };
    if (currentSession) {
      query._id = { $ne: currentSession._id };
    }

    const result = await Session.updateMany(query, { isActive: false });

    return res.status(200).json(
      new ApiResponse(200, {
        terminatedCount: result.modifiedCount,
      }, `Terminated ${result.modifiedCount} other sessions`)
    );
  });

  /**
   * Check if session is active
   * @route GET /api/v1/sessions/check/:id
   */
  checkSession = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({ _id: id, userId });
    if (!session) {
      return res.status(200).json(
        new ApiResponse(200, {
          isActive: false,
          message: "Session not found",
        })
      );
    }

    return res.status(200).json(
      new ApiResponse(200, {
        isActive: session.isActive && !session.isExpired(),
        lastActivity: session.lastActivity,
        expiresAt: session.expiresAt,
      })
    );
  });
}

export default new SessionController();