import { useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useGetNotesQuery } from "../../../store/services/notes.api";
import NoteCard from "../components/NoteCard";
import ChatWidget from "../../../components/chat/ChatWidget";

const Home = () => {
  const [searchParams] = useSearchParams();

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

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.data.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
      <ChatWidget />
    </div>
  );
};

export default Home;
