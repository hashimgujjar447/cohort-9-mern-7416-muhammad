import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";

import Home from "../features/notes/pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ChangePasswordPage from "../features/auth/pages/ChangePasswordPage";
import RequestResetPasswordPage from "../features/auth/pages/RequestResetPasswordPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <RequestResetPasswordPage />,
      },
      {
        path: "/reset-password/:token",
        element: <ChangePasswordPage />,
      },
      {
        path: "/verify-account",
        element: <VerifyEmailPage />,
      },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);
