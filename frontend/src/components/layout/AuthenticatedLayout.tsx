import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useAppSelector } from "../../store/hooks";
import { useGetProfileQuery } from "../../store/services/auth.api";
import Header from "./Header";

const AuthenticatedLayout = () => {
  const location = useLocation();

  const { accessToken, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  const { isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !accessToken || !isAuthenticated,
  });

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <ClipLoader size={24} />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="px-15 py-3">
      <Header />
      <Outlet />
    </div>
  );
};

export default AuthenticatedLayout;
