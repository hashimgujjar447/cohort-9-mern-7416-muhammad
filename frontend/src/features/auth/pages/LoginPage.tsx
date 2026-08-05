import Input from "../../../components/ui/Input";
import { Lock, Mail, UserRound } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import type { LoginDataType } from "../types";
import { useLoginMutation } from "../../../store/services/auth.api";
import { loginSchema } from "../auth.validation";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../store/hooks";
import { login as loginSuccess } from "../../../store/feature/auth.slice";

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
      }

      toast.success(res.message);

      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? error?.message ?? "Something went wrong.",
      );
    }
  };
  return (
    <div className="flex h-screen px-20 py-20 justify-around ">
      <div className="w-100 mt-10">
        <img src="/regLogIcon.png" alt="" />
      </div>
      <div className="flex justify-center flex-col">
        <h1 className="text-primary-text mb-2 text-3xl text-center font-extrabold">
          Securely Save Your Important Data
        </h1>
        <p className="text-center text-secondary-text text-lg">
          Log in to continue
        </p>
        <form className="flex flex-col mt-4 gap-4" onSubmit={handleLoginForm}>
          <Input
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            type="email"
            placeholder="Email"
            icon={Mail}
          />
          <Input
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            type="password"
            placeholder="Password"
            icon={Lock}
          />
          <div className=" text-sm text-right ">
            Forget your password ?{" "}
            <Link
              to={"/forgot-password"}
              className="text-text-blue hover:underline"
            >
              Click to reset
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="bg-secondary-text text-white rounded-full px-6"
            >
              {isLoading ? "Logging In ..." : "Log In"}
            </Button>
          </div>
        </form>

        <div className="my-2 text-sm text-center font-medium">
          Don't have an account ?{" "}
          <Link to={"/register"} className="text-text-blue hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
