import type {
  ChangePasswordDataType,
  ChangePasswordResponse,
  GetProfileResponse,
  LoginDataType,
  LoginResponse,
  RefreshAccessTokenResponse,
  RegisterDataType,
  RegisterResponse,
  SendPasswordResetLinkDataType,
  SendPasswordResetLinkResponse,
  VerifyEmailResponse,
  VerifyEmailType,
} from "../../features/auth/types";
import { baseApi } from "./base.api";
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDataType>({
      query: (data: LoginDataType) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterDataType>({
      query: (data: RegisterDataType) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query<GetProfileResponse, void>({
      query: () => "/auth/me",
    }),

    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailType>({
      query: (data: VerifyEmailType) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    sendPasswordResetLink: builder.mutation<
      SendPasswordResetLinkResponse,
      SendPasswordResetLinkDataType
    >({
      query: (data: SendPasswordResetLinkDataType) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    refreshAccessToken: builder.mutation<RefreshAccessTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include",
      }),
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordDataType
    >({
      query: ({
        token,
        password,
        confirmPassword,
      }: ChangePasswordDataType) => ({
        url: `/auth/reset-password/${token}`,
        method: "PUT",
        body: { password, confirmPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useVerifyEmailMutation,
  useSendPasswordResetLinkMutation,
  useChangePasswordMutation,
  useRefreshAccessTokenMutation,
  useLazyGetProfileQuery,
} = authApi;
