import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Download, Plus, Search, Upload, UserRound } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  useCreateNoteMutation,
  useGetNotesQuery,
} from "../../store/services/notes.api";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: notesData } = useGetNotesQuery({});
  const [createNote, { isLoading: isImporting }] = useCreateNoteMutation();

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

  const handleExportNotes = () => {
    if (!notesData?.data?.length) {
      toast.error("No notes available to export");
      return;
    }

    const exportData = notesData.data.map((note) => ({
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      isPinned: note.isPinned,
      isArchived: note.isArchived,
      createdAt: note.createdAt,
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2),
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `notes-export-${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success("Notes exported successfully");
  };

  const handleImportNotes = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const notesToImport = Array.isArray(parsed) ? parsed : [parsed];

        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const validNotes = notesToImport.filter((n: any) => {
          if (!n || typeof n !== "object") return false;
          if (
            typeof n.title !== "string" ||
            !n.title.trim() ||
            n.title.trim().length > 100
          )
            return false;
          if (
            typeof n.content !== "string" ||
            !n.content.trim() ||
            n.content.trim().length > 10000
          )
            return false;
          return true;
        });

        if (validNotes.length === 0) {
          toast.error("Invalid or empty notes JSON file");
          return;
        }

        let successCount = 0;
        for (const n of validNotes) {
          const cleanedTags = Array.isArray(n.tags)
            ? n.tags
                .filter(
                  (t: any) =>
                    typeof t === "string" &&
                    t.trim().length > 0 &&
                    t.trim().length <= 30,
                )
                .map((t: string) => t.trim())
                .slice(0, 10)
            : [];

          const validColor =
            typeof n.color === "string" && hexRegex.test(n.color.trim())
              ? n.color.trim()
              : undefined;

          try {
            await createNote({
              title: n.title.trim(),
              content: n.content.trim(),
              tags: cleanedTags,
              color: validColor,
            }).unwrap();
            successCount++;
          } catch {}
        }

        if (successCount > 0) {
          toast.success(`${successCount} note(s) imported successfully`);
        } else {
          toast.error("Failed to import notes");
        }
      } catch {
        toast.error("Failed to parse JSON file");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

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
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportNotes}
              accept=".json"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              title="Import Notes (JSON)"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bg-light text-secondary-text transition hover:bg-gray-200 disabled:opacity-50"
              aria-label="Import Notes"
            >
              <Upload size={18} />
            </button>

            <button
              type="button"
              onClick={handleExportNotes}
              title="Export Notes (JSON)"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bg-light text-secondary-text transition hover:bg-gray-200"
              aria-label="Export Notes"
            >
              <Download size={18} />
            </button>

            <div title="Create Note">
              <Button
                onClick={() => navigate("/notes/create")}
                className="cursor-pointer rounded-full bg-secondary-text text-white"
                Icon={Plus}
              >
                Create
              </Button>
            </div>
          </>
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
