import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useState, type FormEvent } from "react";
import { useSendPasswordResetLinkMutation } from "../../../store/services/auth.api";
import toast from "react-hot-toast";

const RequestResetPasswordPage = () => {
  const [sendPasswordResetLink, { isLoading }] =
    useSendPasswordResetLinkMutation();
  const [email, setEmail] = useState<string>("");
  const handleForgotPasswordForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Email is required");
    }

    try {
      const res = await sendPasswordResetLink({ email: email }).unwrap();
      if (!res.success) {
        return toast.error(res?.message);
      }

      toast.success(res?.message);
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
          Forgot Password?
        </h1>

        <p className="mt-3 text-center text-secondary-text">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleForgotPasswordForm}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            icon={Mail}
          />

          <Button
            type="submit"
            className="w-full rounded-full bg-secondary-text py-3 text-white transition-all duration-300 hover:opacity-90"
          >
            {isLoading ? "Sending link ...." : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-primary-text">
          Remember your password?{" "}
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

export default RequestResetPasswordPage;
