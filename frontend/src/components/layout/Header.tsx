import { useEffect, useState } from "react";
import { Plus, Search, UserRound } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Input from "../ui/Input";
import Button from "../ui/Button";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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

  const showCreateButton = location.pathname === "/";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go to home"
      >
        <img src="/logo.png" alt="Website logo" className="w-16 sm:w-20" />
      </button>

      <div className="order-3 w-full sm:order-2 sm:w-72 md:w-96 lg:w-[420px]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search"
          inputStyle="h-11"
          icon={Search}
        />
      </div>

      <div className="order-2 flex items-center gap-x-2 sm:order-3">
        {showCreateButton && (
          <div title="Create Note">
            <Button
              onClick={() => navigate("/notes/create")}
              className="cursor-pointer rounded-full bg-secondary-text text-white"
              Icon={Plus}
            >
              Create
            </Button>
          </div>
        )}

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
