import React, { useState } from "react";
import Input from "../ui/Input";
import { Plus, Search, UserRound } from "lucide-react";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center">
      <div
        onClick={() => {
          navigate("/");
        }}
      >
        <img src="/logo.png" alt="Website logo" className="w-20 " />
      </div>
      <div className="w-100">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search"
          style="h-11 "
          icon={Search}
        />
      </div>
      <div className="flex items-center gap-x-2">
        <div title="Create Note">
          <Button
            onClick={() => {
              navigate("/notes/create");
            }}
            className="bg-secondary-text text-white rounded-full hover:cursor-pointer"
            Icon={Plus}
          >
            Create
          </Button>
        </div>
        <Link
          to={"/profile"}
          title="Open Profile"
          className="flex items-center w-10 h-10 rounded-full hover:cursor-pointer bg-bg-light justify-center"
        >
          <UserRound />
        </Link>
      </div>
    </header>
  );
};

export default Header;
