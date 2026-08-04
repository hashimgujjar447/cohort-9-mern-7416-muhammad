import { Link } from "react-router-dom";
import type { INote } from "../types";

interface NoteCardProps {
  note: INote;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const date = new Date(note.createdAt);
  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date();

  return (
    <Link
      to={`/notes/${note._id}`}
      className="w-90 h-50 rounded-4xl bg-white px-8 py-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
    >
      <h2 className="text-2xl font-bold text-secondary-text">{note.title}</h2>
      <div className="mt-4 flex-1">
        <p className="line-clamp-4 text-sm text-gray-700">{note.content}</p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm text-text-blue">
          {formattedDate.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="text-sm font-medium text-blue-600">Read More →</span>
      </div>
    </Link>
  );
};

export default NoteCard;
