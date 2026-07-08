// server/src/templates/verifyEmailTemplate.js

/**
 * Generates a modern, responsive HTML email template for email verification
 * Designed to work across all major email clients (Gmail, Outlook, Yahoo, Apple Mail)
 * Uses only inline CSS for maximum compatibility
 * 
 * @param {string} name - User's full name
 * @param {string} verificationUrl - Full verification URL with token
 * @returns {string} - Complete HTML email template
 */
const verifyEmailTemplate = (name, verificationUrl) => {
  // Escape HTML entities to prevent XSS
  const safeName = name ? name.replace(/[&<>"]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    if (m === '"') return '&quot;';
    return m;
  }) : 'User';

  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Main email container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#f4f7fc" style="background-color: #f4f7fc; padding: 40px 0;">
    <tr>
      <td align="center" style="padding: 0 20px;">
        
        <!-- Email wrapper - max width 600px -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
          <tr>
            <td style="padding: 40px 40px 30px 40px;" align="center">
              
              <!-- Logo placeholder -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 25px auto;">
                <tr>
                  <td align="center" style="background-color: #2563eb; border-radius: 12px; padding: 12px 20px;">
                    <span style="color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">🔐 AuthLab</span>
                  </td>
                </tr>
              </table>
              
              <!-- Welcome header -->
              <h1 style="color: #1f2937; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.2;">
                Verify Your Email
              </h1>
              
              <p style="color: #6b7280; font-size: 16px; margin: 0 0 8px 0; line-height: 1.5;">
                Please confirm your email address to complete your registration
              </p>
              
              <div style="width: 60px; height: 4px; background-color: #2563eb; border-radius: 2px; margin: 20px auto 30px auto;"></div>
              
              <!-- Greeting -->
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
                Hello <strong style="color: #1f2937;">${safeName}</strong>,
              </p>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0; text-align: left;">
                Thank you for creating an account with Advanced Auth &amp; Security Lab. 
                To activate your account and access all features, please verify your email address 
                by clicking the button below.
              </p>
              
              <!-- Verification button -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 30px 0 35px 0;">
                <tr>
                  <td align="center" bgcolor="#2563eb" style="background-color: #2563eb; border-radius: 8px;">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 14px 45px; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; border: 1px solid #2563eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                      ✅ Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Manual verification link -->
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 25px 0; text-align: center;">
                Or copy and paste this link into your browser:
              </p>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 14px 18px; margin: 0 0 25px 0; word-break: break-all; border: 1px solid #e5e7eb;">
                <a href="${verificationUrl}" target="_blank" style="color: #2563eb; font-size: 13px; text-decoration: none; font-family: 'Courier New', Courier, monospace;">
                  ${verificationUrl}
                </a>
              </div>
              
              <!-- Expiry information -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 6px; margin: 0 0 25px 0; text-align: left;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                  ⏰ This verification link will expire in <strong>24 hours</strong>.
                  If you don't verify within this time, you'll need to request a new verification email.
                </p>
              </div>
              
              <!-- Security note -->
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 5px 0; text-align: left;">
                🔒 If you didn't create an account, you can safely ignore this email.
              </p>
              
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 5px 0; text-align: left;">
                🤖 This is an automated message, please do not reply to this email.
              </p>
              
              <!-- Divider -->
              <div style="border-top: 1px solid #e5e7eb; margin: 35px 0 20px 0;"></div>
              
              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 5px 0;">
                      &copy; ${new Date().getFullYear()} Advanced Auth &amp; Security Lab
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
                      Built with ❤️ for security-first applications
                    </p>
                    <p style="color: #d1d5db; font-size: 11px; line-height: 1.4; margin: 12px 0 0 0;">
                      This email was sent to <span style="color: #9ca3af;">${verificationUrl ? 'your email address' : 'you'}</span>
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
        
        <!-- Mobile optimized spacer -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; line-height: 1.4; margin: 0;">
                Need help? Contact our support team
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
  
  <!-- Outlook conditional styles -->
  <!--[if (gte mso 9)|(IE)]>
  <style>
    .button-link {
      background: #2563eb;
      padding: 14px 45px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      display: inline-block;
    }
  </style>
  <![endif]-->
  
</body>
</html>
  `;
};

export default verifyEmailTemplate;