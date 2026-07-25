import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "./auth.model.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { generateAccessToken } from "../../utils/generateAccessToken.js";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";
import { serviceResponse } from "../../utils/apiResponse.js";
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

class AuthService {
  async register(data: RegisterDto) {
    const { firstName, lastName, username, email, password } = data;

    const existingUser = await UserModel.findOne({ email });
    const isUserNameAlreadyExist = await UserModel.findOne({ username });
    if (isUserNameAlreadyExist) {
      return serviceResponse(
        409,
        false,
        "Username already exists. Please write another username",
      );
    }

    if (existingUser?.isVerified) {
      return serviceResponse(409, false, "User already exists. Please login.");
    }

    const { otp, hashedOtp, expiresAt } = await generateOtp();

    if (existingUser) {
      existingUser.emailVerificationToken = hashedOtp;
      existingUser.emailVerificationTokenExpiry = expiresAt;
      await existingUser.save();
      await sendVerificationEmail(email, otp);
      return serviceResponse(
        200,
        true,
        "A new verification OTP has been sent to your email.",
      );
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

    await sendVerificationEmail(email, otp);

    return serviceResponse(
      201,
      true,
      "Registration successful. Please verify your email.",
    );
  }

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await UserModel.findOne({ email });

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

    user.refreshToken = refreshToken;
    await user.save();

    return serviceResponse(200, true, "Login successful", {
      accessToken,
      refreshToken,
    });
  }

  async verifyEmail(data: VerifyEmailDto) {
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

  async resetPasswordRequest(data: ResetPasswordRequestDto) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return serviceResponse(
        200,
        true,
        "If an account exists with this email, a password reset link has been sent.",
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.PASSWORD_RESET_SECRET as string,
      { expiresIn: "20m" },
    );

    user.resetPasswordToken = token;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 20);
    user.passwordResetTokenExpiry = expiry;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${token}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    return serviceResponse(
      200,
      true,
      "If an account exists with this email, a password reset link has been sent.",
    );
  }

  async changeUserPassword(data: ChangePasswordDto) {
    const { token, password } = data;

    let decoded: ResetPasswordTokenPayload;

    try {
      decoded = jwt.verify(
        token,
        process.env.PASSWORD_RESET_SECRET as string,
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

    const user = await UserModel.findById(decoded.userId);

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

  async refreshAccessToken(refreshToken: string) {
    let decoded: IJwtPayload;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
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

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return serviceResponse(401, false, "User not found.");
    }

    if (user.refreshToken !== refreshToken) {
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

  async logout(userId: string) {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    return serviceResponse(200, true, "Logout successful");
  }
}

export default new AuthService();
