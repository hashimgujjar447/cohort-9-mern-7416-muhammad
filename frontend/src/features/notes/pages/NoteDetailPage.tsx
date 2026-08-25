import {
  ArrowLeft,
  Calendar,
  Edit,
  Tag,
  Trash2,
  Pin,
  Archive,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useDeleteNoteMutation,
  useGetSingleNoteQuery,
} from "../../../store/services/notes.api";
import { useAppSelector } from "../../../store/hooks";
import { ClipLoader } from "react-spinners";

const NoteDetailPage = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();

  const user = useAppSelector((state) => state.auth.user);

  const [deleteNote, { isLoading: isDeleteNoteLoading }] =
    useDeleteNoteMutation();

  const { data, isLoading, isError } = useGetSingleNoteQuery(noteId ?? "", {
    skip: !noteId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <ClipLoader size={24} />

        <p className="text-lg font-medium">Loading note detail...</p>
      </div>
    );
  }

  if (isError || !data?.note) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h1 className="text-xl font-semibold text-red-500">Note not found.</h1>
      </div>
    );
  }

  const note = data.note;

  const createdDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const handleDeleteNote = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) return;

    try {
      const res = await deleteNote({ noteId: note._id }).unwrap();

      toast.success(res.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong.");
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white p-4 shadow-lg sm:mt-10 sm:rounded-3xl sm:p-8 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={`/notes/${note._id}/edit`}
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white transition hover:bg-blue-600 sm:gap-2 sm:px-4 sm:py-2 sm:text-base"
          >
            <Edit size={18} />
            Edit
          </Link>

          <button
            onClick={handleDeleteNote}
            disabled={isDeleteNoteLoading}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2 sm:text-base"
          >
            <Trash2 size={18} />
            {isDeleteNoteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-secondary-text sm:mt-8 sm:text-3xl md:text-4xl">
        {note.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {createdDate}
        </div>

        {note.color && (
          <div className="flex items-center gap-2">
            <span>Color</span>
            <div
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: note.color }}
            />
          </div>
        )}

        {note.isPinned && (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            <Pin size={14} />
            Pinned
          </span>
        )}

        {note.isArchived && (
          <span className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
            <Archive size={14} />
            Archived
          </span>
        )}
      </div>

      {note.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
          {note.tags.map((tag: string) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
            >
              <Tag size={14} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl bg-gray-50 p-4 sm:mt-8 sm:rounded-2xl sm:p-6">
        <div
          className="
    leading-8 text-gray-700
    [&_h1]:text-3xl [&_h1]:font-bold
    [&_h2]:text-2xl [&_h2]:font-bold
    [&_h3]:text-xl [&_h3]:font-semibold
    [&_p]:mb-3
    [&_ul]:list-disc [&_ul]:pl-6
    [&_ol]:list-decimal [&_ol]:pl-6
    [&_strong]:font-bold
  "
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      <div className="mt-8 border-t pt-6 text-sm text-gray-500">
        <p>
          Created by{" "}
          <span className="font-semibold text-secondary-text">
            {user?.username}
          </span>
        </p>
      </div>
    </div>
  );
};

export default NoteDetailPage;
