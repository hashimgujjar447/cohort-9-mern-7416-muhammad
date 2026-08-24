import Input from "../../../components/ui/Input";
import { Lock, Mail } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import type { LoginDataType } from "../types";
import { useLoginMutation } from "../../../store/services/auth.api";
import { loginSchema } from "../auth.validation";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../store/hooks";
import { login as loginSuccess } from "../../../store/feature/auth.slice";
import { baseApi } from "../../../store/services/base.api";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState<LoginDataType>({
    email: "",
    password: "",
  });

  const handleLoginForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedData = loginSchema.safeParse(formData);

    if (!parsedData.success) {
      return toast.error(parsedData.error.issues[0].message);
    }

    try {
      const res = await login(parsedData.data).unwrap();

      if (res.success) {
        if (!res.data?.accessToken) {
          toast.error("Login response is missing required data.");
          return;
        }

        dispatch(
          loginSuccess({
            accessToken: res.data.accessToken,
            user: null,
          }),
        );

        dispatch(baseApi.util.resetApiState());

        toast.success(res.message);
        navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? error?.message ?? "Something went wrong.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-10 lg:flex-row lg:justify-around lg:px-20 lg:py-20">
      <div className="hidden w-64 md:block md:w-80 lg:w-96">
        <img src="/regLogIcon.png" alt="" className="w-full object-contain" />
      </div>

      <div className="flex w-full max-w-md flex-col justify-center">
        <h1 className="mb-2 text-center text-2xl font-extrabold text-primary-text sm:text-3xl">
          Securely Save Your Important Data
        </h1>

        <p className="text-center text-base text-secondary-text sm:text-lg">
          Log in to continue
        </p>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleLoginForm}>
          <Input
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            type="email"
            placeholder="Email"
            icon={Mail}
          />

          <Input
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            type="password"
            placeholder="Password"
            icon={Lock}
          />

          <div className="text-right text-sm">
            Forget your password?{" "}
            <Link
              to="/forgot-password"
              className="text-text-blue hover:underline"
            >
              Click to reset
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="rounded-full bg-secondary-text px-6 text-white"
            >
              {isLoading ? "Logging In ..." : "Log In"}
            </Button>
          </div>
        </form>

        <div className="my-2 text-center text-sm font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-text-blue hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
