// server/src/services/email.service.js

import transporter from "../config/mail.js";
import { ApiError } from "../utils/ApiError.js";
import verifyEmailTemplate from "../templates/verifyEmailTemplate.js";
import forgotPasswordTemplate from "../templates/forgotPasswordTemplate.js";
import welcomeEmailTemplate from "../templates/welcomeEmailTemplate.js";

class EmailService {
  async sendEmail({ to, subject, html, from }) {
    if (!to || !subject || !html) {
      throw new ApiError(400, "Missing required email parameters.");
    }

    try {
      const info = await transporter.sendMail({
        from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("📧 Email Sent:", info.messageId);
      }

      return info;
    } catch (error) {
      console.error("Email Error:", error);

      throw new ApiError(
        500,
        "Unable to send email. Please try again later."
      );
    }
  }

  async sendVerificationEmail({ email, name, token, baseUrl }) {
    const verificationLink = `${baseUrl}/api/v1/auth/verify-email/${token}`;
    const html = verifyEmailTemplate(name, verificationLink);

    return this.sendEmail({
      to: email,
      subject: "Verify Your Email",
      html,
    });
  }

  async sendPasswordResetEmail({ email, name, token, baseUrl }) {
    const resetLink = `${baseUrl}/reset-password/${token}`;
    const html = forgotPasswordTemplate(name, resetLink);

    return this.sendEmail({
      to: email,
      subject: "Reset Your Password",
      html,
    });
  }

  async sendWelcomeEmail({ email, name }) {
    const html = welcomeEmailTemplate(name);

    return this.sendEmail({
      to: email,
      subject: "Welcome to Advanced Auth & Security Lab",
      html,
    });
  }

  // Add this method to server/src/services/email.service.js

/**
 * Send OTP email
 */
/**
 * Send OTP email
 */
async sendOTPEmail({ email, name, otp }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #0a0a0f;
            color: #ffffff;
          }
          .container {
            background: rgba(255,255,255,0.05);
            padding: 40px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
          }
          .otp-code {
            background: rgba(37,99,235,0.1);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            color: #2563eb;
            margin: 20px 0;
            border: 1px solid rgba(37,99,235,0.2);
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 14px;
            color: rgba(255,255,255,0.4);
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 OTP Verification</h1>
          </div>
          <p>Hello ${name || "User"},</p>
          <p>Your One-Time Password (OTP) is:</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Advanced Auth & Security Lab</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return this.sendEmail({
    to: email,
    subject: "Your OTP Code - Advanced Auth & Security Lab",
    html,
  });
}
}

export default new EmailService();