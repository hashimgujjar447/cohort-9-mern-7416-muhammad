import { BadgeCheck, CalendarDays, FileText, LogOut, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import Button from "../../../components/ui/Button";
import { logout } from "../../../store/feature/auth.slice";
import {
  useLogoutMutation,
  useGetProfileQuery,
} from "../../../store/services/auth.api";
import { useGetNotesQuery } from "../../../store/services/notes.api";
import { useAppDispatch } from "../../../store/hooks";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery();

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  const {
    data: notesData,
    isLoading: isLoadingNotes,
    isError: isNotesError,
  } = useGetNotesQuery({});

  if (isProfileLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <ClipLoader size={24} />
        <p className="mt-2 text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  if (isProfileError || !profileData?.data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load profile.
        </p>
      </div>
    );
  }

  const user = profileData.data;

  const totalNotes = notesData?.data?.length ?? 0;

  const initials = `${user.firstName?.charAt(0) ?? ""}${
    user.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center bg-bg-light px-6 py-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-text text-3xl font-bold text-white">
            {initials}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>

          <p className="mt-1 text-gray-500">@{user.username}</p>

          {user.isVerified && (
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-green-600">
              <BadgeCheck size={18} />
              Email Verified
            </div>
          )}
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-light">
              <Mail size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-gray-500">Email</p>
              <p className="truncate font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-light">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-light">
              <FileText size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Notes</p>

              {isLoadingNotes ? (
                <ClipLoader size={18} />
              ) : isNotesError ? (
                <p className="font-medium text-red-500">Unable to load</p>
              ) : (
                <p className="text-xl font-bold text-gray-900">{totalNotes}</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            Icon={LogOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
