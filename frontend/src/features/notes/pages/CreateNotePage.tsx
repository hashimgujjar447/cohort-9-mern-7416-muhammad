import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Tiptap from "../../../components/editor/text-editor";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import { useCreateNoteMutation } from "../../../store/services/notes.api";

const CreateNotePage = () => {
  const navigate = useNavigate();

  const [createNote, { isLoading: createNoteLoading }] =
    useCreateNoteMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");

  const handleAddTag = () => {
    const newTag = tag.trim();

    if (!newTag) {
      toast.error("Tag name is required");
      return;
    }

    const exists = tags.some(
      (existingTag) => existingTag.toLowerCase() === newTag.toLowerCase(),
    );

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
    setTags((prev) =>
      prev.filter((existingTag) => existingTag !== tagToRemove),
    );
    toast.success("Tag removed");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      const res = await createNote({
        title: title.trim(),
        content,
        tags,
      }).unwrap();

      toast.success(res.message || "Note created successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
      <button
        type="button"
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
          style="rounded-md"
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
            type="button"
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

      <Button
        type="button"
        handleClick={handleCreate}
        disabled={createNoteLoading}
        className="w-full rounded-xl bg-text-blue py-3 text-white"
      >
        {createNoteLoading ? `Creating Note ...` : "Create Note"}
      </Button>
    </div>
  );
};

export default CreateNotePage;
