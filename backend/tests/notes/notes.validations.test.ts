import { expect } from "chai";
import mongoose from "mongoose";
import {
  createNoteSchema,
  deleteNoteSchema,
  getSingleNoteSchema,
  updateNoteSchema,
} from "../../src/modules/notes/notes.validations.js";

describe("Notes Validations", () => {
  describe("Create Note Validation", () => {
    it("Should fail when title is empty", () => {
      const parsed = createNoteSchema.safeParse({
        title: "",
        content: "Content",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should fail when content is empty", () => {
      const parsed = createNoteSchema.safeParse({
        title: "My Note",
        content: "",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should pass with valid data", () => {
      const parsed = createNoteSchema.safeParse({
        title: "My Note",
        content: "Content",
      });

      expect(parsed.success).to.be.true;
    });
  });

  describe("Update Note Validation", () => {
    it("Should fail when noteId is empty", () => {
      const parsed = updateNoteSchema.safeParse({
        noteId: "",
        title: "Title",
        content: "Content",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should fail when title is empty", () => {
      const parsed = updateNoteSchema.safeParse({
        noteId: new mongoose.Types.ObjectId().toString(),
        title: "",
        content: "Content",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should fail when content is empty", () => {
      const parsed = updateNoteSchema.safeParse({
        noteId: new mongoose.Types.ObjectId().toString(),
        title: "Title",
        content: "",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should pass with valid data", () => {
      const parsed = updateNoteSchema.safeParse({
        noteId: new mongoose.Types.ObjectId().toString(), // <-- fix
        title: "Updated Note",
        content: "Updated Content",
      });

      expect(parsed.success).to.be.true;
    });
  });

  describe("Delete Note Validation", () => {
    it("Should fail when noteId is empty", () => {
      const parsed = deleteNoteSchema.safeParse({
        noteId: "",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should pass with valid noteId", () => {
      const parsed = deleteNoteSchema.safeParse({
        noteId: new mongoose.Types.ObjectId().toString(), // <-- fix
      });

      expect(parsed.success).to.be.true;
    });
  });

  describe("Get Single Note Validation", () => {
    it("Should fail when noteId is empty", () => {
      const parsed = getSingleNoteSchema.safeParse({
        noteId: "",
      });

      expect(parsed.success).to.be.false;
    });

    it("Should pass with valid noteId", () => {
      const parsed = getSingleNoteSchema.safeParse({
        noteId: new mongoose.Types.ObjectId().toString(), // <-- fix
      });

      expect(parsed.success).to.be.true;
    });
  });
});
