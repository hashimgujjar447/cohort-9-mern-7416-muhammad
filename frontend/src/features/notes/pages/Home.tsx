import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useGetNotesQuery } from "../../../store/services/notes.api";
import NoteCard from "../components/NoteCard";
import ChatWidget from "../../../components/chat/ChatWidget";

const Home = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<"all" | "pinned" | "archived">("all");

  const search = searchParams.get("search") || undefined;

  const { data, isLoading, isError } = useGetNotesQuery({
    search,
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <ClipLoader size={24} />

        <p className="text-lg font-medium">Loading notes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load notes.
        </p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg text-gray-500">
          {search
            ? `No notes found for "${search}".`
            : "No notes available. Create your first note."}
        </p>
        <ChatWidget />
      </div>
    );
  }

  const filteredNotes = data.data.filter((note) => {
    if (filter === "pinned") return note.isPinned;
    if (filter === "archived") return note.isArchived;
    return true;
  });

  return (
    <div className="mt-6 sm:mt-10">
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition ${
            filter === "all"
              ? "bg-secondary-text text-white"
              : "bg-bg-light text-secondary-text hover:bg-gray-200"
          }`}
        >
          All ({data.data.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("pinned")}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition ${
            filter === "pinned"
              ? "bg-secondary-text text-white"
              : "bg-bg-light text-secondary-text hover:bg-gray-200"
          }`}
        >
          Pinned ({data.data.filter((n) => n.isPinned).length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("archived")}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition ${
            filter === "archived"
              ? "bg-secondary-text text-white"
              : "bg-bg-light text-secondary-text hover:bg-gray-200"
          }`}
        >
          Archived ({data.data.filter((n) => n.isArchived).length})
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex h-[40vh] items-center justify-center">
          <p className="text-lg text-gray-500">
            No {filter} notes found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
      <ChatWidget />
    </div>
  );
};

export default Home;
