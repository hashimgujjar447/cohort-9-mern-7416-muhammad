import {
  type BaseQueryFn,
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setAccessToken } from "../feature/auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // First request
  let result = await baseQuery(args, api, extraOptions);

  // If access token expired
  if (result.error?.status === 401) {
    // Try to refresh access token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const response = refreshResult.data as {
        data: {
          accessToken: string;
        };
      };

      // Save new access token
      api.dispatch(setAccessToken(response.data.accessToken));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token is also invalid
      api.dispatch(logout());
    }
  }

  return result;
};
