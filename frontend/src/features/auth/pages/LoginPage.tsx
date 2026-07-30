import Input from "../../../components/ui/Input";
import { Lock, Mail, UserRound } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";

const LoginPage = () => {
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
        <form className="flex flex-col mt-4 gap-4">
          <Input type="email" placeholder="Email" icon={Mail} />
          <Input type="password" placeholder="Password" icon={Lock} />
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
            <Button className="bg-secondary-text text-white rounded-full px-6">
              Log In
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
