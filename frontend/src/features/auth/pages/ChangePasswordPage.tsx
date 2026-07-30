import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useChangePasswordMutation } from "../../../store/services/auth.api";
import { changePasswordSchema } from "../auth.validation";

const ChangePasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Invalid password reset link.");
    }

    const parsedData = changePasswordSchema.safeParse(formData);

    if (!parsedData.success) {
      return toast.error(parsedData.error.issues[0].message);
    }

    try {
      const res = await changePassword({
        token,
        password: parsedData.data.password,
        confirmPassword: parsedData.data.confirmPassword,
      }).unwrap();

      toast.success(res.message);

      navigate("/login");
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-bold text-primary-text">
          Reset Password
        </h1>

        <p className="mt-3 text-center text-secondary-text">
          Create a new password for your account.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleChangePassword}>
          <Input
            type="password"
            placeholder="New Password"
            icon={Lock}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />

          <Button
            type="submit"
            className="w-full rounded-full bg-secondary-text py-3 text-white transition-all duration-300 hover:opacity-90"
          >
            {isLoading ? "Updating Password..." : "Reset Password"}
          </Button>
        </form>

        <p className="mt-6 text-center text-primary-text">
          Back to{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
