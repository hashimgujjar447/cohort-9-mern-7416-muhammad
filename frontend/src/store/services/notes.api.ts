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
    getNotes: builder.query<GetAllNotesResponse, void>({
      query: () => ({
        url: "/note/all",
        method: "GET",
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
    }),

    updateNote: builder.mutation<UpdateNoteResponse, IUpdateNoteRequest>({
      query: ({ noteId, ...data }) => ({
        url: `/note/${noteId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["notes"],
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
