import { Document, Types } from "mongoose";
import { IJwtPayload } from "../auth/auth.types.js";

export interface INotes extends Document {
  title: string;
  content: string;
  tags: string[];
  color?: string;
  isPinned: boolean;
  isArchived: boolean;
  user: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateServiceDTO = {
  title: string;
  content: string;
  tags?: string[];
  color?: string;
  user: IJwtPayload;
};

export type GetAllNotesDTO = {
  user: IJwtPayload;
  search?: string;
};

export type GetSingleNoteDTO = {
  noteId: string;
  user: IJwtPayload;
};

export type UpdateNoteDTO = {
  noteId: string;
  title: string;
  content: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  user: IJwtPayload;
};
export type DeleteNoteDTO = {
  noteId: string;
  user: IJwtPayload;
};
