import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const RequestResetPasswordPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-bold text-primary-text">
          Forgot Password?
        </h1>

        <p className="mt-3 text-center text-secondary-text">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form className="mt-8 space-y-5">
          <Input type="email" placeholder="Enter your email" icon={Mail} />

          <Button
            type="submit"
            className="w-full rounded-full bg-secondary-text py-3 text-white transition-all duration-300 hover:opacity-90"
          >
            Send Reset Link
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
