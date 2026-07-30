import type { ApiResponse } from "../../types/api";

export type { ApiResponse };

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface RegisterDataType {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginDataType {
  email: string;
  password: string;
}

export interface VerifyEmailType {
  email: string;
  otpCode: string;
}

export interface SendPasswordResetLinkDataType {
  email: string;
}

export interface ChangePasswordDataType {
  token: string;
  password: string;
  confirmPassword: string;
}

// Response Types
export interface LoginResponseData {
  accessToken: string;
  user?: IUser;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse;
export type VerifyEmailResponse = ApiResponse;
export type SendPasswordResetLinkResponse = ApiResponse;
export type ChangePasswordResponse = ApiResponse;

export type GetProfileResponse = ApiResponse<IUser>;
export type LogoutResponse = ApiResponse;

export interface RefreshAccessTokenResponseData {
  accessToken: string;
}

export type RefreshAccessTokenResponse =
  ApiResponse<RefreshAccessTokenResponseData>;
