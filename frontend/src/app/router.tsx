import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";

import Home from "../features/notes/pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ChangePasswordPage from "../features/auth/pages/ChangePasswordPage";
import RequestResetPasswordPage from "../features/auth/pages/RequestResetPasswordPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import NoteDetailPage from "../features/notes/pages/NoteDetailPage";
import NoteEditPage from "../features/notes/pages/NoteEditPage";
import CreateNotePage from "../features/notes/pages/CreateNotePage";
import ProfilePage from "../features/user/pages/ProfilePage";

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
      {
        path: "/notes/:noteId",
        element: <NoteDetailPage />,
      },
      {
        path: "/notes/:noteId/edit",
        element: <NoteEditPage />,
      },
      {
        path: "/notes/create",
        element: <CreateNotePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
