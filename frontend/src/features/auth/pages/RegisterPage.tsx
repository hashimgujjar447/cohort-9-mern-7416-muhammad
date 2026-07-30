import React from "react";
import Input from "../../../components/ui/Input";
import { Lock, Mail, UserRound } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex h-screen px-20 py-20 justify-around ">
      <div className="w-120 ">
        <img src="/regLogIcon.png" alt="" />
      </div>
      <div>
        <h1 className="text-primary-text mb-2 text-3xl text-center font-extrabold">
          Securely Save Your Important Data
        </h1>
        <p className="text-center text-secondary-text text-xl">
          Partner With Us. Start Today
        </p>
        <form className="flex flex-col mt-4 gap-4">
          <Input type="text" placeholder="Username" icon={UserRound} />
          <Input type="email" placeholder="Email" icon={Mail} />
          <Input type="password" placeholder="Password" icon={Lock} />
          <Input type="password" placeholder="Confirm Password" icon={Lock} />
          <div className="flex items-center justify-center">
            <Button className="bg-secondary-text text-white rounded-full px-6">
              Sign Up
            </Button>
          </div>
        </form>

        <div className="my-2 text-sm text-center font-medium">
          Already have an account ?{" "}
          <Link to={"/login"} className="text-text-blue hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
