import React, { useState, type FormEvent } from "react";
import Input from "../../../components/ui/Input";
import { Lock, Mail, UserRound } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";
import { registerSchema } from "../auth.validation";
import type { RegisterDataType } from "../types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../../../store/services/auth.api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState<RegisterDataType>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedData = registerSchema.safeParse(formData);

    if (!parsedData.success) {
      return toast.error(parsedData.error.issues[0].message);
    }

    try {
      const res = await register(parsedData.data).unwrap();

      toast.success(res.message);

      navigate("/verify-account", {
        state: {
          email: formData.email,
        },
      });
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        "Something went wrong. Please try again.";

      toast.error(message);

      // Agar OTP already send ho chuki hai to verify page par bhej do
      if (
        message ===
          "A email verification OTP is already send on your email please check" ||
        message === "A new verification OTP has been sent to your email."
      ) {
        navigate("/verify-account", {
          state: {
            email: formData.email,
          },
        });
      }
    }
  };

  return (
    <div className="flex h-screen justify-around px-20 py-20">
      <div className="w-120">
        <img src="/regLogIcon.png" alt="Register Illustration" />
      </div>

      <div>
        <h1 className="mb-2 text-center text-3xl font-extrabold text-primary-text">
          Securely Save Your Important Data
        </h1>

        <p className="text-center text-xl text-secondary-text">
          Partner With Us. Start Today
        </p>

        <form
          onSubmit={handleRegisterSubmit}
          className="mt-4 flex flex-col gap-4"
        >
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            type="text"
            placeholder="First Name"
            icon={UserRound}
          />

          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            type="text"
            placeholder="Last Name"
            icon={UserRound}
          />

          <Input
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
            type="text"
            placeholder="Username"
            icon={UserRound}
          />

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

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className="rounded-full bg-secondary-text px-6 text-white"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </form>

        <div className="my-2 text-center text-sm font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-text-blue hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
