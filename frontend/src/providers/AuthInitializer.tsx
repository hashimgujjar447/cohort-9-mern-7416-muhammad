import { useEffect, type ReactNode } from "react";
import { useAppDispatch } from "../store/hooks";
import { useLazyGetProfileQuery } from "../store/services/auth.api";
import { setLoading, setUser } from "../store/feature/auth.slice";

interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const dispatch = useAppDispatch();

  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));

      try {
        const profileResponse = await getProfile().unwrap();

        if (profileResponse.data) {
          dispatch(setUser(profileResponse.data));
        }
      } catch (error) {
        // User is not authenticated
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch, getProfile]);

  return children;
};

export default AuthInitializer;
