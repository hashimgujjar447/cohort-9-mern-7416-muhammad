import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const deleteNoteSchema = z.object({
  noteId: z.string().trim().min(1, "Note id is required"),
});

export const getSingleNoteSchema = z.object({
  noteId: z.string().trim().min(1, "Note id is required"),
});

export const updateNoteSchema = z.object({
  noteId: z.string().min(1),
  title: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1),
});
