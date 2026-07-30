import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../../components/ui/Button";

const VerifyEmailPage = () => {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-bg px-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-bold text-primary-text">
          Verify Account
        </h1>

        <p className="mt-3 text-center text-secondary-text">
          Please enter the 6-digit code sent to your email.
        </p>

        <form className="mt-8 space-y-6">
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
            Verify
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
