import { baseApi } from "./base.api";

import type {
  ICreateNoteRequest,
  IDeleteNoteRequest,
  IUpdateNoteRequest,
  CreateNoteResponse,
  DeleteNoteResponse,
  GetAllNotesResponse,
  GetSingleNoteResponse,
  UpdateNoteResponse,
} from "../../features/notes/types";

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<GetAllNotesResponse, { search?: string }>({
      query: ({ search }) => ({
        url: "/note/all",
        method: "GET",
        params: search ? { search } : undefined,
      }),
      providesTags: ["notes"],
    }),

    createNote: builder.mutation<CreateNoteResponse, ICreateNoteRequest>({
      query: (data) => ({
        url: "/note/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notes"],
    }),

    getSingleNote: builder.query<GetSingleNoteResponse, string>({
      query: (noteId) => ({
        url: `/note/${noteId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, noteId) => [
        { type: "singleNote", id: noteId },
      ],
    }),

    updateNote: builder.mutation<UpdateNoteResponse, IUpdateNoteRequest>({
      query: ({ noteId, ...data }) => ({
        url: `/note/${noteId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { noteId }) => [
        "notes",
        { type: "singleNote", id: noteId },
      ],
    }),

    deleteNote: builder.mutation<DeleteNoteResponse, IDeleteNoteRequest>({
      query: ({ noteId }) => ({
        url: `/note/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notes"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useGetSingleNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
