import { useGetNotesQuery } from "../../../store/services/notes.api";
import NoteCard from "../components/NoteCard";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const { data, isLoading, isError } = useGetNotesQuery();

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

  if (data && !data?.data?.length) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg text-gray-500">
          No notes available. Create your first note.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap justify-between gap-y-10">
      {data?.data?.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
};

export default Home;
