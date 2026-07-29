import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware.js";
import notesController from "./notes.controller.js";
const router = Router();

router.post(
  "/create",
  AuthMiddleware,
  asyncHandler(notesController.createNote),
);
router.get("/all", AuthMiddleware, asyncHandler(notesController.getAllNotes));
router.get(
  "/:noteId",
  AuthMiddleware,
  asyncHandler(notesController.getNoteById),
);
router.delete(
  "/:noteId",
  AuthMiddleware,
  asyncHandler(notesController.deleteNote),
);
router.put(
  "/:noteId",
  AuthMiddleware,
  asyncHandler(notesController.updateNote),
);
export default router;
