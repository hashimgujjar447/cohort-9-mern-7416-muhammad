import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.isValidObjectId(value), "Invalid note id.");

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(10000, "Content cannot exceed 10000 characters."),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty.")
        .max(30, "Tag cannot exceed 30 characters."),
    )
    .max(10, "A note can have at most 10 tags.")
    .optional(),

  color: z
    .string()
    .trim()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Color must be a valid HEX color.",
    )
    .optional(),
});

export const updateNoteSchema = z.object({
  noteId: objectIdSchema,

  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(10000, "Content cannot exceed 10000 characters."),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty.")
        .max(30, "Tag cannot exceed 30 characters."),
    )
    .max(10, "A note can have at most 10 tags.")
    .optional(),

  color: z
    .string()
    .trim()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Color must be a valid HEX color.",
    )
    .optional(),

  isPinned: z.boolean().optional(),

  isArchived: z.boolean().optional(),
});

export const getSingleNoteSchema = z.object({
  noteId: objectIdSchema,
});

export const deleteNoteSchema = z.object({
  noteId: objectIdSchema,
});
