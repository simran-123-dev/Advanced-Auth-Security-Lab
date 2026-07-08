// server/src/templates/welcomeEmailTemplate.js

/**
 * Generates a modern, responsive HTML email template for welcome email
 * Sent after successful email verification
 * Designed to work across all major email clients
 * Uses only inline CSS for maximum compatibility
 * 
 * @param {string} name - User's full name
 * @returns {string} - Complete HTML email template
 */
const welcomeEmailTemplate = (name) => {
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
  <title>Welcome to Advanced Auth & Security Lab</title>
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
                Welcome to Advanced Auth &amp; Security Lab! 🎉
              </h1>
              
              <p style="color: #6b7280; font-size: 16px; margin: 0 0 8px 0; line-height: 1.5;">
                Your email has been verified successfully
              </p>
              
              <div style="width: 60px; height: 4px; background-color: #2563eb; border-radius: 2px; margin: 20px auto 30px auto;"></div>
              
              <!-- Greeting -->
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: left;">
                Hello <strong style="color: #1f2937;">${safeName}</strong>,
              </p>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0; text-align: left;">
                Welcome to the Advanced Auth &amp; Security Lab! Your account has been successfully verified and you're now ready to explore all the features of our secure authentication system.
              </p>
              
              <!-- Feature grid -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0 30px 0;">
                <tr>
                  <td style="padding: 0 5px 10px 5px; width: 50%;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 8px; padding: 15px;">
                      <tr>
                        <td align="center">
                          <span style="font-size: 24px; display: block; margin-bottom: 5px;">🔐</span>
                          <strong style="color: #1f2937; font-size: 14px; display: block;">Secure Auth</strong>
                          <span style="color: #6b7280; font-size: 12px;">JWT with refresh tokens</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0 5px 10px 5px; width: 50%;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 8px; padding: 15px;">
                      <tr>
                        <td align="center">
                          <span style="font-size: 24px; display: block; margin-bottom: 5px;">🛡️</span>
                          <strong style="color: #1f2937; font-size: 14px; display: block;">Protection</strong>
                          <span style="color: #6b7280; font-size: 12px;">Helmet, CORS, rate limiting</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 5px 10px 5px; width: 50%;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 8px; padding: 15px;">
                      <tr>
                        <td align="center">
                          <span style="font-size: 24px; display: block; margin-bottom: 5px;">📧</span>
                          <strong style="color: #1f2937; font-size: 14px; display: block;">Email Security</strong>
                          <span style="color: #6b7280; font-size: 12px;">Verified &amp; secure emails</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0 5px 10px 5px; width: 50%;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 8px; padding: 15px;">
                      <tr>
                        <td align="center">
                          <span style="font-size: 24px; display: block; margin-bottom: 5px;">⚡</span>
                          <strong style="color: #1f2937; font-size: 14px; display: block;">Performance</strong>
                          <span style="color: #6b7280; font-size: 12px;">Optimized &amp; production-ready</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Getting started -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 18px; margin: 0 0 25px 0; text-align: left; border: 1px solid #bfdbfe;">
                <p style="color: #1e40af; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">
                  🚀 Getting Started
                </p>
                <ul style="color: #1e3a8a; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>You can now log in with your credentials</li>
                  <li>Explore our secure authentication features</li>
                  <li>Learn about security best practices</li>
                  <li>Build your own secure applications</li>
                </ul>
              </div>
              
              <!-- Security note -->
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 5px 0; text-align: left;">
                🔒 Your account is now secure with email verification.
              </p>
              
              <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 5px 0; text-align: left;">
                📧 We'll keep you updated about security features and best practices.
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
                      This is a system-generated email. Please do not reply.
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
  
</body>
</html>
  `;
};

export default welcomeEmailTemplate;