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

  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}
