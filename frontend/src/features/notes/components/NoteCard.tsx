import { Link } from "react-router-dom";
import { Archive, Pin } from "lucide-react";
import type { INote } from "../types";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";
interface NoteCardProps {
  note: INote;
}

const NoteCard = ({ note }: NoteCardProps) => {
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
      className="flex min-h-[200px] w-full flex-col rounded-3xl bg-white px-6 py-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-4xl sm:px-8 sm:py-6"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-bold text-secondary-text sm:text-2xl">
          {note.title}
        </h2>
        <div className="flex shrink-0 items-center gap-1.5">
          {note.isPinned && (
            <span
              title="Pinned"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-yellow-700"
            >
              <Pin size={14} />
            </span>
          )}
          {note.isArchived && (
            <span
              title="Archived"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700"
            >
              <Archive size={14} />
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex-1">
        <div
          className="line-clamp-4 text-sm text-gray-700"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(note.content),
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
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
