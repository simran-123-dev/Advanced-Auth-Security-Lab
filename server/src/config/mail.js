// server/src/config/mail.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Email configuration for production-ready Nodemailer setup
 * Uses Gmail SMTP with secure transport
 */
const createTransporter = () => {
  // Validate required environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error(
      "Email configuration error: EMAIL_USER and EMAIL_PASS must be set in environment variables"
    );
  }

  // Create transporter with Gmail SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // Secure connection settings
    secure: true,
    tls: {
      rejectUnauthorized: true,
    },
    // Connection timeout settings
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // Verify transporter configuration on creation
  const verifyTransporter = async () => {
    try {
      await transporter.verify();
      console.log("✅ Email transporter configured successfully");
    } catch (error) {
      console.error("❌ Email transporter verification failed:", error.message);
      throw new Error(`Email service initialization failed: ${error.message}`);
    }
  };

  verifyTransporter().catch((error) => {
    console.error("Email service startup warning:", error.message);
  });

  return transporter;
};

// Create and export the transporter instance
const transporter = createTransporter();

export default transporter;