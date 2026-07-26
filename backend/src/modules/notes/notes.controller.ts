import { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createNoteSchema,
  deleteNoteSchema,
  getSingleNoteSchema,
  updateNoteSchema,
} from "./notes.validations.js";
import notesService from "./notes.service.js";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, message: error.issues[0].message });

class NotesController {
  async createNote(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: "Please login first" });
        return;
      }
      const parsed = createNoteSchema.safeParse(req.body);
      if (!parsed.success) return validationError(res, parsed.error);
      const n = await notesService.createNoteService({ ...parsed.data, user });
      res
        .status(n.status)
        .json({ success: n.success, message: n.message, data: n.note });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async getAllNotes(req: Request, res: Response) {
    try {
      const user = req?.user;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      const result = await notesService.getAllNotesService(user);
      return res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.notes,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async getNoteById(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      const parsed = getSingleNoteSchema.safeParse(req.params);
      if (!parsed.success) return validationError(res, parsed.error);
      const result = await notesService.getSingleNoteService({
        ...parsed.data,
        user,
      });
      return res.status(result.status).json({
        success: result.success,
        message: result.message,
        note: result.note,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async deleteNote(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      const parsed = deleteNoteSchema.safeParse(req.params);
      if (!parsed.success) return validationError(res, parsed.error);
      const result = await notesService.deleteNoteService({
        ...parsed.data,
        user,
      });
      return res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
  async updateNote(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      const parsed = updateNoteSchema.safeParse({ ...req.params, ...req.body });
      if (!parsed.success) return validationError(res, parsed.error);
      const result = await notesService.updateNoteService({
        ...parsed.data,
        user,
      });
      return res.status(result.status).json({
        success: result.success,
        message: result.message,
        note: result.note,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
}

export default new NotesController();
