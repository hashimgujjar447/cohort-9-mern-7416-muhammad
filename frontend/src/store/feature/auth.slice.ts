import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
interface IAuthSlice {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
}
const initialState: IAuthSlice = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "Auth",
  initialState: initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: IUser;
      }>,
    ) {
      ((state.accessToken = action.payload.accessToken),
        (state.user = action.payload.user));
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
