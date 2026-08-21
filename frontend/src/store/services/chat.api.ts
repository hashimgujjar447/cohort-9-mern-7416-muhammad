import { baseApi } from "./base.api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type ChatRequest = {
  query: string;
};

type ChatResponse = {
  success: boolean;
  message: string;
  response: string;
  messages: ChatMessage[];
};

type MessagesResponse = {
  success: boolean;
  message: string;
  messages: ChatMessage[];
};

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    chatWithAI: builder.mutation<ChatResponse, ChatRequest>({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["ChatMessages"],
    }),

    getChatMessages: builder.query<MessagesResponse, void>({
      query: () => ({
        url: "/chat/messages",
        method: "GET",
      }),

      providesTags: ["ChatMessages"],
    }),
  }),
});

export const { useChatWithAIMutation, useGetChatMessagesQuery } = chatApi;
