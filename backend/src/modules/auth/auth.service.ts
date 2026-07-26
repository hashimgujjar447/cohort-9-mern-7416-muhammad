import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import UserModel from "./auth.model.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { generateAccessToken } from "../../utils/generateAccessToken.js";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";
import {
  type ServiceResponse,
  serviceResponse,
} from "../../utils/apiResponse.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../utils/sendEmail.js";
import type {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ResetPasswordRequestDto,
  ChangePasswordDto,
  ResetPasswordTokenPayload,
  IJwtPayload,
} from "./auth.types.js";
import { getEnv } from "../../utils/env.js";
import logger from "../../config/logger.js";

class AuthService {
  async register(data: RegisterDto): Promise<ServiceResponse> {
    const { firstName, lastName, username, email, password } = data;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return serviceResponse(
          409,
          false,
          "User already exists. Please login.",
        );
      }

      const { otp, hashedOtp, expiresAt } = await generateOtp();

      existingUser.emailVerificationToken = hashedOtp;
      existingUser.emailVerificationTokenExpiry = expiresAt;

      await existingUser.save();

      if (process.env.NODE_ENV !== "test") {
        await sendVerificationEmail(email, otp);
      }

      return serviceResponse(
        200,
        true,
        "A new verification OTP has been sent to your email.",
      );
    }

    const usernameExists = await UserModel.findOne({ username });

    if (usernameExists) {
      return serviceResponse(
        409,
        false,
        "Username already exists. Please write another username",
      );
    }

    const { otp, hashedOtp, expiresAt } = await generateOtp();

    await UserModel.create({
      firstName,
      lastName,
      username,
      email,
      password,
      emailVerificationToken: hashedOtp,
      emailVerificationTokenExpiry: expiresAt,
    });

    if (process.env.NODE_ENV !== "test") {
      await sendVerificationEmail(email, otp);
    }

    return serviceResponse(
      201,
      true,
      "Registration successful. Please verify your email.",
    );
  }

  async login(data: LoginDto): Promise<
    ServiceResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const { email, password } = data;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return serviceResponse(
        401,
        false,
        "Invalid credentials please register or enter correct credentials",
      );
    }

    if (!user.isVerified) {
      return serviceResponse(
        401,
        false,
        "Account is not verified please verify your account first.",
      );
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return serviceResponse(401, false, "Please enter a correct password");
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    user.refreshToken = hashedRefreshToken;
    await user.save();

    return serviceResponse(200, true, "Login successful", {
      accessToken,
      refreshToken,
    });
  }

  async verifyEmail(data: VerifyEmailDto): Promise<ServiceResponse> {
    const { email, otpCode } = data;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return serviceResponse(404, false, "User not found");
    }

    if (user.isVerified) {
      return serviceResponse(409, false, "Email already verified");
    }

    if (!user.emailVerificationToken || !user.emailVerificationTokenExpiry) {
      return serviceResponse(400, false, "Verification OTP not found");
    }

    if (new Date(user.emailVerificationTokenExpiry).getTime() < Date.now()) {
      return serviceResponse(400, false, "OTP has expired");
    }

    const isOtpValid = await bcrypt.compare(
      otpCode,
      user.emailVerificationToken,
    );

    if (!isOtpValid) {
      return serviceResponse(400, false, "Invalid OTP");
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    return serviceResponse(200, true, "Email verified successfully");
  }

  async resetPasswordRequest(
    data: ResetPasswordRequestDto,
  ): Promise<ServiceResponse> {
    const user = await UserModel.findOne({ email: data.email });

    if (!user) {
      return serviceResponse(
        200,
        true,
        "If an account exists with this email, a password reset link has been sent.",
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      getEnv("PASSWORD_RESET_SECRET"),
      { expiresIn: "20m" },
    );

    user.resetPasswordToken = token;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 20);
    user.passwordResetTokenExpiry = expiry;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${token}`;

    if (process.env.NODE_ENV !== "test") {
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return serviceResponse(
      200,
      true,
      "If an account exists with this email, a password reset link has been sent.",
    );
  }

  async changeUserPassword(data: ChangePasswordDto): Promise<ServiceResponse> {
    const { token, password } = data;

    let decoded: ResetPasswordTokenPayload;

    try {
      decoded = jwt.verify(
        token,
        getEnv("PASSWORD_RESET_SECRET"),
      ) as ResetPasswordTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return serviceResponse(401, false, "Reset password token has expired.");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return serviceResponse(401, false, "Invalid reset password token.");
      }
      throw error;
    }

    const user = await UserModel.findById(decoded.userId).select(
      "+resetPasswordToken +passwordResetTokenExpiry",
    );

    if (!user) {
      return serviceResponse(404, false, "User not found.");
    }

    if (user.resetPasswordToken !== token) {
      return serviceResponse(401, false, "Invalid reset password token.");
    }

    if (
      !user.passwordResetTokenExpiry ||
      user.passwordResetTokenExpiry < new Date()
    ) {
      return serviceResponse(401, false, "Reset password token has expired.");
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.passwordResetTokenExpiry = null;

    await user.save();

    return serviceResponse(200, true, "Password changed successfully.");
  }

  async refreshAccessToken(refreshToken: string): Promise<
    ServiceResponse<{
      accessToken: string;
    }>
  > {
    let decoded: IJwtPayload;

    try {
      decoded = jwt.verify(
        refreshToken,
        getEnv("REFRESH_TOKEN_SECRET"),
      ) as IJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return serviceResponse(
          401,
          false,
          "Refresh token has expired. Please login again.",
        );
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return serviceResponse(401, false, "Invalid refresh token.");
      }

      throw error;
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const user = await UserModel.findOne({
      _id: decoded.userId,
      refreshToken: hashedRefreshToken,
    });

    if (!user) {
      return serviceResponse(
        401,
        false,
        "Refresh token is invalid or has been revoked.",
      );
    }

    const accessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    });

    return serviceResponse(200, true, "Access token refreshed successfully.", {
      accessToken,
    });
  }

  async logout(userId: string): Promise<ServiceResponse> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    return serviceResponse(200, true, "Logout successful");
  }
}

export default new AuthService();
