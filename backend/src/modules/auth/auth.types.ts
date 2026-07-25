import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;

  isVerified: boolean;

  emailVerificationToken: string | null;
  emailVerificationTokenExpiry: Date | null;

  resetPasswordToken: string | null;
  passwordResetTokenExpiry: Date | null;

  refreshToken: string | null;

  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface RegisterDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ChangePasswordDto {
  token: string;
  password: string;
}

// ─── Internal ─────────────────────────────────────────────────────────────────

export interface ResetPasswordTokenPayload {
  userId: string;
  email: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  username: string;
}
