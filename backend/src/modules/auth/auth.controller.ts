import { Request, Response } from "express";
import { RegisterResponse } from "./auth.types.js";
import UserModel from "./auth.model.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { transporter } from "../../services/email.service.js";

import bcrypt from "bcryptjs";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";
import { generateAccessToken } from "../../utils/generateAccessToken.js";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

type ResetPasswordParams = {
  token: string;
};

interface ResetPasswordTokenPayload {
  userId: string;
  email: string;
}

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, username, email, password } = req.body;

      if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      const existingUser = await UserModel.findOne({ email });

      if (existingUser?.isVerified) {
        return res.status(409).json({
          success: false,
          message: "User already exists. Please login.",
        });
      }

      const { otp, hashedOtp, expiresAt } = await generateOtp();

      if (existingUser) {
        existingUser.emailVerificationToken = hashedOtp;
        existingUser.emailVerificationTokenExpiry = expiresAt;

        await existingUser.save();

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Verify your email",
          html: `
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        `,
        });

        return res.status(200).json({
          success: true,
          message: "A new verification OTP has been sent to your email.",
        });
      }

      await UserModel.create({
        firstName,
        lastName,
        username,
        email,
        password,
        emailVerificationToken: hashedOtp,
        emailVerificationTokenExpiry: expiresAt,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your email",
        html: `
        <h2>Welcome</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
      });

      return res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Both email and password are required",
        });
      }

      const isUserAccountExist = await UserModel.findOne({ email: email });
      if (!isUserAccountExist) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid credentials please register or enter correct credentials",
        });
      }

      if (isUserAccountExist && !isUserAccountExist.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Account is not verified please verify your account first.",
        });
      }

      const isPasswordMatch =
        await isUserAccountExist.comparePassword(password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Please enter a correct password",
        });
      }

      const refreshToken = generateRefreshToken({
        userId: isUserAccountExist._id.toString(),
        email: isUserAccountExist.email,
        username: isUserAccountExist.username,
      });

      const accessToken = generateAccessToken({
        userId: isUserAccountExist._id.toString(),
        email: isUserAccountExist.email,
        username: isUserAccountExist.username,
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          data: {
            accessToken: accessToken,
          },
        });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, otpCode } = req.body;

      if (!email || !otpCode) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.isVerified) {
        return res.status(409).json({
          success: false,
          message: "Email already verified",
        });
      }

      if (!user.emailVerificationToken || !user.emailVerificationTokenExpiry) {
        return res.status(400).json({
          success: false,
          message: "Verification OTP not found",
        });
      }

      if (new Date(user.emailVerificationTokenExpiry).getTime() < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      }

      const isOtpValid = await bcrypt.compare(
        otpCode,
        user.emailVerificationToken,
      );

      if (!isOtpValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      user.isVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationTokenExpiry = null;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async resetPasswordRequest(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter your email where we can send the reset password link.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const user = await UserModel.findOne({ email: normalizedEmail });

      // Don't reveal whether the email exists or not
      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.PASSWORD_RESET_SECRET as string,
        {
          expiresIn: "20m",
        },
      );

      user.resetPasswordToken = token;

      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 20);
      user.passwordResetTokenExpiry = expiry;

      await user.save();

      const url = `${process.env.CLIENT_URL}/resetPassword/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Reset your password",
        html: `
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password.</p>

        <a
          href="${url}"
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

      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  async changeUserPassword(req: Request<ResetPasswordParams>, res: Response) {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;

      if (!password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password must match.",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.PASSWORD_RESET_SECRET as string,
      ) as ResetPasswordTokenPayload;

      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (user.resetPasswordToken !== token) {
        return res.status(401).json({
          success: false,
          message: "Invalid reset password token.",
        });
      }

      if (
        !user.passwordResetTokenExpiry ||
        user.passwordResetTokenExpiry < new Date()
      ) {
        return res.status(401).json({
          success: false,
          message: "Reset password token has expired.",
        });
      }

      user.password = password;

      // Clear token after successful password reset
      user.resetPasswordToken = null;
      user.passwordResetTokenExpiry = null;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Password changed successfully.",
      });
    } catch (error) {
      console.error(error);

      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Reset password token has expired.",
        });
      }

      if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: "Invalid reset password token.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  async logout(req: Request, res: Response) {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: "Please login first to register",
      });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}

export default new AuthController();
