const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass && host !== "smtp.gmail.com" && pass !== "your-app-password") {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });
  } else {
    // In dev / mock SMTP mode, use a stream transport that logs the email
    transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
  }

  return transporter;
}

/**
 * Sends a password reset email with secure token link.
 */
async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const mailTransporter = getTransporter();
  const from = process.env.SMTP_FROM || '"B.H.U.M.I. Security" <no-reply@bhumi.gov.in>';

  const mailOptions = {
    from,
    to,
    subject: "Reset your B.H.U.M.I. Password",
    text: `Hello ${name},\n\nYou requested a password reset for your B.H.U.M.I. account. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.\n\nBest regards,\nB.H.U.M.I. Security Team`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">B.H.U.M.I.</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Digital Land Registry System</p>
        </div>
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">Password Reset Request</h3>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            Hello <strong>${name}</strong>,
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            We received a request to reset the password for your account (<strong>${to}</strong>). Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            <strong>Important:</strong> This link is only valid for <strong>1 hour</strong> and can only be used once. If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #0284c7;">${resetUrl}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`\n📬 [B.H.U.M.I. Mailer] Password reset email prepared for ${to}`);
    console.log(`🔗 [Password Reset URL]: ${resetUrl}\n`);
    return info;
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    // Still log the reset URL to console so the user is never stuck in development
    console.log(`🔗 [Password Reset URL (Fallback)]: ${resetUrl}\n`);
    return null;
  }
}

module.exports = {
  sendPasswordResetEmail,
};
