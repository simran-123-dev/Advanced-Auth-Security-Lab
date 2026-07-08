// server/src/routes/session.routes.js

import express from "express";
import sessionController from "../controllers/session.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Session Routes
 * All routes are prefixed with /api/v1/sessions
 * All routes require authentication
 */

/**
 * @route   GET /api/v1/sessions
 * @desc    Get all active sessions for current user
 * @access  Private
 */
router.get("/", verifyJWT, sessionController.getMySessions);

/**
 * @route   GET /api/v1/sessions/:id
 * @desc    Get session by ID
 * @access  Private
 */
router.get("/:id", verifyJWT, sessionController.getSessionById);

/**
 * @route   DELETE /api/v1/sessions/:id
 * @desc    Terminate a specific session
 * @access  Private
 */
router.delete("/:id", verifyJWT, sessionController.terminateSession);

/**
 * @route   DELETE /api/v1/sessions/terminate-all
 * @desc    Terminate all other sessions (keep current)
 * @access  Private
 */
router.delete("/terminate-all", verifyJWT, sessionController.terminateAllOtherSessions);

/**
 * @route   GET /api/v1/sessions/check/:id
 * @desc    Check if session is active
 * @access  Private
 */
router.get("/check/:id", verifyJWT, sessionController.checkSession);

export default router;