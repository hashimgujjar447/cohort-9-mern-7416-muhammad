import {
  CreateServiceDTO,
  DeleteNoteDTO,
  GetAllNotesDTO,
  GetSingleNoteDTO,
  INotes,
  UpdateNoteDTO,
} from "./notes.types.js";
import { Note } from "./notes.model.js";
import {
  serviceResponse,
  type ServiceResponse,
} from "../../utils/apiResponse.js";

class NotesService {
  async createNoteService(
    data: CreateServiceDTO,
  ): Promise<ServiceResponse<{ note: INotes }>> {
    const { title, content, tags, color, user } = data;

    const isNoteWithSameTitleAlreadyExist = await Note.findOne({
      user: user.userId,
      title,
    });

    if (isNoteWithSameTitleAlreadyExist) {
      return serviceResponse(
        409,
        false,
        "Note with the same title already exists",
      );
    }

    const note = await Note.create({
      title,
      content,
      tags,
      color,
      user: user.userId,
    });
    return serviceResponse(201, true, "Note created successfully", {
      note,
    });
  }

  async getAllNotesService(
    user: GetAllNotesDTO,
  ): Promise<ServiceResponse<{ notes: INotes[] }>> {
    const notes = await Note.find({
      user: user.userId,
    });

    return serviceResponse(200, true, "All notes fetched successfully", {
      notes,
    });
  }

  async getSingleNoteService(
    data: GetSingleNoteDTO,
  ): Promise<ServiceResponse<{ note: INotes }>> {
    const note = await Note.findOne({
      _id: data.noteId,
      user: data.user.userId,
    });

    if (!note) {
      return serviceResponse(404, false, "No note found with this id");
    }

    return serviceResponse(200, true, "Note fetched successfully", {
      note,
    });
  }

  async updateNoteService(
    data: UpdateNoteDTO,
  ): Promise<ServiceResponse<{ note: INotes }>> {
    const { noteId, title, content, tags, color, isPinned, isArchived, user } =
      data;

    const note = await Note.findOne({
      _id: noteId,
      user: user.userId,
    });

    if (!note) {
      return serviceResponse(404, false, "No note found with this id");
    }

    const duplicateTitle = await Note.findOne({
      _id: { $ne: noteId },
      user: user.userId,
      title,
    });

    if (duplicateTitle) {
      return serviceResponse(
        409,
        false,
        "Note with the same title already exists",
      );
    }

    note.title = title;
    note.content = content;

    if (tags !== undefined) {
      note.tags = tags;
    }

    if (color !== undefined) {
      note.color = color;
    }

    if (isPinned !== undefined) {
      note.isPinned = isPinned;
    }

    if (isArchived !== undefined) {
      note.isArchived = isArchived;
    }

    await note.save();

    return serviceResponse(200, true, "Note updated successfully", {
      note,
    });
  }

  async deleteNoteService(data: DeleteNoteDTO): Promise<ServiceResponse> {
    const deletedNote = await Note.findOneAndDelete({
      _id: data.noteId,
      user: data.user.userId,
    });

    if (!deletedNote) {
      return serviceResponse(404, false, "No note found with this id");
    }

    return serviceResponse(200, true, "Note deleted successfully");
  }
}

export default new NotesService();
