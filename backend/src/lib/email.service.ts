import nodemailer from 'nodemailer';

// Configure Nodemailer transporter (uses SMTP environment variables or fallback test transport)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'agrimove.system@gmail.com',
    pass: process.env.SMTP_PASS || 'agrimove_pass_2026',
  },
});

/**
 * Sends a Password Reset Link email to the specified recipient.
 */
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #D3EE98; rounded-radius: 12px; background-color: #f8fdf8;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #D3EE98;">
        <h2 style="color: #3a7a3e; margin: 0;">🚛 AgriMove Logistics</h2>
      </div>
      <div style="padding: 20px 0;">
        <h3 style="color: #333;">Password Reset Request</h3>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">
          We received a request to reset your password for your AgriMove account. Click the button below to set a new password:
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetLink}" style="background-color: #72BF78; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #777; font-size: 12px; line-height: 1.4;">
          If you did not request a password reset, you can safely ignore this email. This reset link will expire in 30 minutes.
        </p>
        <p style="color: #999; font-size: 11px; margin-top: 15px; word-break: break-all;">
          Direct Link: <a href="${resetLink}" style="color: #3a7a3e;">${resetLink}</a>
        </p>
      </div>
      <div style="border-top: 1px solid #D3EE98; padding-top: 15px; text-align: center; color: #888; font-size: 12px;">
        © 2026 AgriMove Inc. East Africa Agricultural Logistics.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"AgriMove Support" <noreply@agrimove.rw>',
      to: email,
      subject: 'Reset your AgriMove password',
      html,
    });
    console.log(`[EmailService] Sent password reset link to ${email}`);
    return true;
  } catch (err) {
    console.warn(`[EmailService] Failed to send email to ${email}:`, (err as Error).message);
    return false;
  }
}

/**
 * Sends an Email Verification link to newly registered users.
 */
export async function sendVerificationEmail(email: string, verifyLink: string, fullName: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #D3EE98; border-radius: 12px; background-color: #f8fdf8;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #D3EE98;">
        <h2 style="color: #3a7a3e; margin: 0;">🚛 Welcome to AgriMove Logistics!</h2>
      </div>
      <div style="padding: 20px 0;">
        <h3 style="color: #333;">Hello ${fullName},</h3>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">
          Thank you for registering with AgriMove! Please verify your email address to confirm your account:
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${verifyLink}" style="background-color: #72BF78; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #777; font-size: 12px; line-height: 1.4;">
          If you did not create an AgriMove account, please ignore this email.
        </p>
        <p style="color: #999; font-size: 11px; margin-top: 15px; word-break: break-all;">
          Direct Link: <a href="${verifyLink}" style="color: #3a7a3e;">${verifyLink}</a>
        </p>
      </div>
      <div style="border-top: 1px solid #D3EE98; padding-top: 15px; text-align: center; color: #888; font-size: 12px;">
        © 2026 AgriMove Inc. East Africa Agricultural Logistics.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"AgriMove Verification" <noreply@agrimove.rw>',
      to: email,
      subject: 'Verify your AgriMove Email Address',
      html,
    });
    console.log(`[EmailService] Sent email verification link to ${email}`);
    return true;
  } catch (err) {
    console.warn(`[EmailService] Failed to send verification email to ${email}:`, (err as Error).message);
    return false;
  }
}

/**
 * Sends a Delivery Status Update email notification.
 */
export async function sendDeliveryStatusEmail(
  email: string,
  deliveryId: string,
  cargo: string,
  status: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #D3EE98; background-color: #f8fdf8;">
      <div style="text-align: center; padding-bottom: 15px; border-bottom: 1px solid #D3EE98;">
        <h2 style="color: #3a7a3e; margin: 0;">🚛 AgriMove Shipment Update</h2>
      </div>
      <div style="padding: 20px 0;">
        <h3 style="color: #333;">Delivery Status Changed: <span style="color: #3a7a3e;">${status}</span></h3>
        <p style="color: #555; font-size: 14px;">
          Your delivery <strong>${deliveryId}</strong> (${cargo}) status has been updated to <strong>${status}</strong>.
        </p>
        <p style="color: #555; font-size: 13px;">
          You can track real-time progress on your AgriMove portal dashboard.
        </p>
      </div>
      <div style="border-top: 1px solid #D3EE98; padding-top: 15px; text-align: center; color: #888; font-size: 12px;">
        © 2026 AgriMove Inc. All rights reserved.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"AgriMove Logistics" <notifications@agrimove.rw>',
      to: email,
      subject: `Update on Delivery ${deliveryId}: ${status}`,
      html,
    });
    return true;
  } catch (err) {
    console.warn(`[EmailService] Failed to send status email:`, (err as Error).message);
    return false;
  }
}
