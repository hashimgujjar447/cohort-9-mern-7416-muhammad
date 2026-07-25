import { transporter } from "../services/email.service.js";

export const sendVerificationEmail = async (
  to: string,
  otp: string,
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetUrl: string,
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password.</p>

      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Reset Password
      </a>

      <p>This link will expire in 20 minutes.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  });
};
