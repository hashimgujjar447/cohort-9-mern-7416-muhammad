import { useEffect, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Tiptap from "../../../components/editor/text-editor";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import {
  useGetSingleNoteQuery,
  useUpdateNoteMutation,
} from "../../../store/services/notes.api";
import { ClipLoader } from "react-spinners";

const NoteEditPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleNoteQuery(noteId!);
  const [updateNote, { isLoading: updateNoteLoading }] =
    useUpdateNoteMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");

  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (!data?.note) return;

    const note = data.note;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags ?? []);
    setIsPinned(note.isPinned);
    setIsArchived(note.isArchived);
    setIsDeleted(note.isDeleted);
  }, [data]);

  const handleAddTag = () => {
    const newTag = tag.trim();

    if (!newTag) {
      toast.error("Tag name is required");
      return;
    }

    const exists = tags.some((t) => t.toLowerCase() === newTag.toLowerCase());

    if (exists) {
      toast.error("Tag already exists");
      setTag("");
      return;
    }

    setTags((prev) => [...prev, newTag]);
    setTag("");
    toast.success("Tag added successfully");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
    toast.success("Tag removed");
  };

  const isEmptyHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim().length === 0;

  const handleUpdate = async () => {
    if (!noteId) {
      return toast.error("Note Id is required");
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (isEmptyHtml(content)) {
      toast.error("Content is required");
      return;
    }

    try {
      const payload = {
        title,
        content,
        tags,
        isPinned,
        isArchived,
        isDeleted,
      };

      const res = await updateNote({
        noteId,
        ...payload,
      }).unwrap();

      toast.success(res.message || "Note Update successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <ClipLoader size={24} />

        <p className="text-lg font-medium">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-lg transition hover:text-text-blue"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Title</h2>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          inputStyle="rounded-md"
        />
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Content</h2>

        <Tiptap
          content={content}
          onChange={(value: string) => setContent(value)}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Tags</h2>

        <div className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <Input
              value={tag}
              placeholder="Add new tag"
              className="h-11"
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
          </div>

          <Button
            handleClick={handleAddTag}
            className="rounded-xl bg-text-blue px-6 text-white"
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 rounded-lg bg-text-blue px-3 py-2 text-white"
            >
              <span>{tag}</span>

              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="rounded-full bg-white p-1 text-black transition hover:bg-red-500 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <Button
          handleClick={() => setIsPinned((prev) => !prev)}
          className={`rounded-xl px-5 ${
            isPinned
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white"
          }`}
        >
          {isPinned ? "Pinned" : "Pin Note"}
        </Button>

        <Button
          handleClick={() => setIsArchived((prev) => !prev)}
          className={`rounded-xl px-5 ${
            isArchived
              ? "bg-green-600 text-white"
              : "border border-gray-300 bg-white"
          }`}
        >
          {isArchived ? "Archived" : "Archive Note"}
        </Button>
      </div>

      <Button
        handleClick={handleUpdate}
        disabled={updateNoteLoading ? true : false}
        className="w-full rounded-xl bg-text-blue py-3 text-white"
      >
        {updateNoteLoading ? "Updating Note ... " : "Update Note"}
      </Button>
    </div>
  );
};

export default NoteEditPage;
