import type { ApiResponse, IUser } from "../auth/types";

export interface INote {
  _id: string;

  title: string;
  content: string;

  tags: string[];
  color?: string;

  isPinned: boolean;
  isArchived: boolean;

  user: string | IUser;

  createdAt: string;
  updatedAt: string;
}

export interface ICreateNoteRequest {
  title: string;
  content: string;

  tags?: string[];
  color?: string;
}

export interface IUpdateNoteRequest {
  noteId: string;

  title: string;
  content: string;

  tags?: string[];
  color?: string;

  isPinned?: boolean;
  isArchived?: boolean;
}

export interface IDeleteNoteRequest {
  noteId: string;
}

export type CreateNoteResponse = ApiResponse<INote>;

export type GetAllNotesResponse = ApiResponse<INote[]>;

export type GetSingleNoteResponse = ApiResponse<{ note: INote }>;

export type UpdateNoteResponse = ApiResponse<INote>;

export type DeleteNoteResponse = ApiResponse;
