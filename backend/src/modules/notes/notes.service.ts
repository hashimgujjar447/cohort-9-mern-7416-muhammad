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

import { aiQueue } from "../../queues/ai.queue.js";
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

    await aiQueue.add("ingest-note", {
      noteId: note._id.toString(),
      userId: note.user.toString(),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    });
    return serviceResponse(201, true, "Note created successfully", {
      note,
    });
  }

  async getAllNotesService({
    user,
    search,
  }: GetAllNotesDTO): Promise<ServiceResponse<{ notes: INotes[] }>> {
    try {
      const filter: Record<string, unknown> = {
        user: user.userId,
      };

      if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
          { title: { $regex: escapedSearch, $options: "i" } },
          { content: { $regex: escapedSearch, $options: "i" } },
          { tags: { $regex: escapedSearch, $options: "i" } },
        ];
      }

      const notes = await Note.find(filter);

      return serviceResponse(200, true, "All notes fetched successfully", {
        notes,
      });
    } catch {
      return serviceResponse(500, false, "Failed to fetch notes");
    }
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

    const dataForUpdateEmbeddings = {
      noteId: note._id.toString(),
      userId: user.userId,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };

    await aiQueue.add("update-note", dataForUpdateEmbeddings);

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

    await aiQueue.add("delete-note", {
      userId: data.user.userId,
      noteId: data.noteId,
    });

    return serviceResponse(200, true, "Note deleted successfully");
  }
}

export default new NotesService();
