import React, { useEffect, useState } from "react";
import { Plus, Search, UserRound } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Input from "../ui/Input";
import Button from "../ui/Button";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(
    searchParams.get("search") || "",
  );

  const navigate = useNavigate();

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set("search", debouncedSearch);
        } else {
          next.delete("search");
        }
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setSearchParams]);

  return (
    <header className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go to home"
      >
        <img src="/logo.png" alt="Website logo" className="w-20" />
      </button>

      <div className="w-100">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search"
          inputStyle="h-11"
          icon={Search}
        />
      </div>

      <div className="flex items-center gap-x-2">
        <div title="Create Note">
          <Button
            onClick={() => navigate("/notes/create")}
            className="cursor-pointer rounded-full bg-secondary-text text-white"
            Icon={Plus}
          >
            Create
          </Button>
        </div>

        <Link
          to="/profile"
          title="Open Profile"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bg-light"
        >
          <UserRound />
        </Link>
      </div>
    </header>
  );
};

export default Header;
