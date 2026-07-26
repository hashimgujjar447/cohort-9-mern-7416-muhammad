import { expect } from "chai";
import notesService from "../../src/modules/notes/notes.service.js";
import { Note } from "../../src/modules/notes/notes.model.js";

describe("Notes Service", () => {
  describe("Notes Service - CreateNote()", () => {
    const mockUser = {
      title: "My First Note",
      content: "This is my first note.",
      user: {
        userId: "6884d5a6c123456789abcdef",
        email: "hashim@example.com",
        username: "hashimcodes",
      },
    };
    it("Should give note created successfully", async () => {
      const data = await notesService.createNoteService(mockUser);

      expect(data.success).to.be.true;
      expect(data.message).to.equal("Note created successfully");
      expect(data.status).to.equal(201);
    });
    it("Should give note with the same title already exist", async () => {
      await Note.create({
        title: "My First Note",
        content: "This is my first note.",
        user: "6884d5a6c123456789abcdef",
      });
      const data = await notesService.createNoteService(mockUser);

      expect(data.status).to.equal(409);
      expect(data.success).to.be.false;
      expect(data.message).to.equal("Note with the same title already exists");
    });
  });

  describe("Note Service GetAllNotes()", () => {
    const user = {
      userId: "6884d5a6c123456789abcdef",
      email: "hashim@example.com",
      username: "hashimcodes",
    };
    it("Should give all notes get successfully", async () => {
      await Note.create({
        title: "My First Note",
        content: "This is my first note.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.getAllNotesService(user);

      expect(data.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.message).to.equal("All notes fetched successfully");
    });
  });

  describe("Note Service deleteNote()", () => {
    const user = {
      userId: "6884d5a6c123456789abcdef",
      email: "hashim@example.com",
      username: "hashimcodes",
    };
    it("Should give note deleted successfully", async () => {
      const note = await Note.create({
        title: "My First Note",
        content: "This is my first note.",
        user: "6884d5a6c123456789abcdef",
      });

      const deleteData = {
        noteId: note._id.toString(),
        user,
      };

      const data = await notesService.deleteNoteService(deleteData);
      expect(data.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.message).to.equal("Note deleted successfully");
    });
    it("Should give no note found with this id", async () => {
      const note = await Note.create({
        title: "My First Note",
        content: "This is my first note.",
        user: "6884d5a6c123456789abcdef",
      });

      const deleteData = {
        noteId: "6884d6b9f2a8c4e7d9b1a3f5",
        user,
      };

      const data = await notesService.deleteNoteService(deleteData);
      expect(data.status).to.equal(404);
      expect(data.success).to.be.false;
      expect(data.message).to.equal("No note found with this id");
    });
  });

  describe("Note Service - getSingleNoteService()", () => {
    const user = {
      userId: "6884d5a6c123456789abcdef",
      email: "hashim@example.com",
      username: "hashimcodes",
    };

    it("should return the note successfully", async () => {
      const note = await Note.create({
        title: "My First Note",
        content: "This is my first note.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.getSingleNoteService({
        noteId: note._id.toString(),
        user,
      });

      expect(data.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.message).to.equal("Note fetched successfully");
      expect(data).to.have.property("note");
    });

    it("should return 404 if note does not exist", async () => {
      const data = await notesService.getSingleNoteService({
        noteId: "6884d6b9f2a8c4e7d9b1a3f5",
        user,
      });

      expect(data.status).to.equal(404);
      expect(data.success).to.be.false;
      expect(data.message).to.equal("No note found with this id");
    });

    it("should not return another user's note", async () => {
      const note = await Note.create({
        title: "My First Note",
        content: "This is my first note.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.getSingleNoteService({
        noteId: note._id.toString(),
        user: {
          userId: "000000000000000000000001",
          email: "other@example.com",
          username: "otheruser",
        },
      });

      expect(data.status).to.equal(404);
      expect(data.success).to.be.false;
    });
  });

  describe("Note Service - updateNoteService()", () => {
    const user = {
      userId: "6884d5a6c123456789abcdef",
      email: "hashim@example.com",
      username: "hashimcodes",
    };

    it("should update the note successfully", async () => {
      const note = await Note.create({
        title: "Old Title",
        content: "Old content.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.updateNoteService({
        noteId: note._id.toString(),
        title: "New Title",
        content: "New content.",
        user,
      });

      expect(data.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.message).to.equal("Note updated successfully");

      const updatedNote = await Note.findById(note._id);
      expect(updatedNote!.title).to.equal("New Title");
      expect(updatedNote!.content).to.equal("New content.");
    });

    it("should return 404 if note does not exist", async () => {
      const data = await notesService.updateNoteService({
        noteId: "6884d6b9f2a8c4e7d9b1a3f5",
        title: "New Title",
        content: "New content.",
        user,
      });

      expect(data.status).to.equal(404);
      expect(data.success).to.be.false;
      expect(data.message).to.equal("No note found with this id");
    });

    it("should return 409 if another note with the same title already exists", async () => {
      await Note.create({
        title: "Existing Title",
        content: "Some content.",
        user: "6884d5a6c123456789abcdef",
      });

      const note = await Note.create({
        title: "Old Title",
        content: "Old content.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.updateNoteService({
        noteId: note._id.toString(),
        title: "Existing Title",
        content: "Updated content.",
        user,
      });

      expect(data.status).to.equal(409);
      expect(data.success).to.be.false;
      expect(data.message).to.equal("Note with the same title already exists");
    });

    it("should allow updating a note with the same title (no change)", async () => {
      const note = await Note.create({
        title: "Same Title",
        content: "Old content.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.updateNoteService({
        noteId: note._id.toString(),
        title: "Same Title",
        content: "Updated content.",
        user,
      });

      expect(data.status).to.equal(200);
      expect(data.success).to.be.true;
      expect(data.message).to.equal("Note updated successfully");
    });

    it("should not update another user's note", async () => {
      const note = await Note.create({
        title: "Old Title",
        content: "Old content.",
        user: "6884d5a6c123456789abcdef",
      });

      const data = await notesService.updateNoteService({
        noteId: note._id.toString(),
        title: "Hacked Title",
        content: "Hacked content.",
        user: {
          userId: "000000000000000000000001",
          email: "other@example.com",
          username: "otheruser",
        },
      });

      expect(data.status).to.equal(404);
      expect(data.success).to.be.false;
    });
  });
});
