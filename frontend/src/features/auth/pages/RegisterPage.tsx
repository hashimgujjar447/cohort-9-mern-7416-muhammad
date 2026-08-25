import { useState, type FormEvent } from "react";
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-10 lg:flex-row lg:justify-around lg:px-20 lg:py-20">
      <div className="hidden w-72 md:block md:w-80 lg:w-[420px]">
        <img src="/regLogIcon.png" alt="Register Illustration" className="w-full object-contain" />
      </div>

      <div className="flex w-full max-w-md flex-col justify-center">
        <h1 className="mb-2 text-center text-2xl font-extrabold text-primary-text sm:text-3xl">
          Securely Save Your Important Data
        </h1>

        <p className="text-center text-lg text-secondary-text sm:text-xl">
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
