import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { useVerifyEmailMutation } from "../../../store/services/auth.api";
import { verifyEmailSchema } from "../auth.validation";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const { state } = useLocation();

  if (!state?.email) {
    return <Navigate to="/register" replace />;
  }

  const [otpCode, setOtpCode] = useState(Array(6).fill(""));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otpCode];
    updatedOtp[index] = value;
    setOtpCode(updatedOtp);

    if (value && index < otpCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otpCode[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const isAllCodeAvailable = otpCode.every((item) => item !== "");
      if (!isAllCodeAvailable) {
        return toast.error("Please enter a valid otp of length 6");
      }
      const otp = otpCode.join("");
      const data = {
        otpCode: otp,
        email: state?.email,
      };

      const parsedData = await verifyEmailSchema.safeParse(data);

      if (!parsedData.success) {
        return toast.error(parsedData.error.issues[0].message);
      }

      const res = await verifyEmail(parsedData.data).unwrap();

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
          Verify Account
        </h1>

        <p className="mt-3 text-center text-secondary-text">
          Please enter the 6-digit code sent to your email.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleVerifyAccount}>
          <div className="flex justify-center gap-3">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                type="text"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl outline-none transition focus:border-blue-500"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-secondary-text py-3 text-white transition hover:opacity-90"
          >
            {isLoading ? "Verifying ..." : "Verify"}
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

export default VerifyEmailPage;
