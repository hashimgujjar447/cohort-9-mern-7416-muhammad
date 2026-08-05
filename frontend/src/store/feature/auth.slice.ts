import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../features/auth/types";

interface IAuthSlice {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
}
const initialState: IAuthSlice = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "Auth",
  initialState: initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: IUser | null;
      }>,
    ) {
      ((state.accessToken = action.payload.accessToken),
        (state.user = action.payload.user));
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, setLoading, setAccessToken, setUser } =
  authSlice.actions;

export default authSlice.reducer;
