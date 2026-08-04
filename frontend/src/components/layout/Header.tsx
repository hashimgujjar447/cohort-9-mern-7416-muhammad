import React, { useState } from "react";
import Input from "../ui/Input";
import { Plus, Search, UserRound } from "lucide-react";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

const Header = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <header className="flex justify-between items-center">
      <div>
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
