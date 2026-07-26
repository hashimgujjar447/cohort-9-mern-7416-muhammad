import mongoose, { Schema } from "mongoose";
import { INotes } from "./notes.types.js";

const NoteSchema = new Schema<INotes>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    color: {
      type: String,
      default: "#FFFFFF",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

NoteSchema.index({ user: 1, title: 1 }, { unique: true });
NoteSchema.index({ title: "text", content: "text" });

export const Note = mongoose.model<INotes>("Note", NoteSchema);
