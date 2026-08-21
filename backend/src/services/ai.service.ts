type NoteAIData = {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
type DeleteNoteAIData = {
  noteId: string;
  userId: string;
};

type ChatMessageHistory = {
  role: "user" | "assistant";
  content: string;
};

type ChatAIData = {
  query: string;
  userId: string;
  history: ChatMessageHistory[];
};

const callAIService = async (endpoint: string, options: RequestInit) => {
  const response = await fetch(
    `${process.env.AI_SERVICE_URL}${endpoint}`,
    options,
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(`AI service failed: ${response.status} - ${errorMessage}`);
  }

  return response.json();
};

export const ingestNoteToAI = async (data: NoteAIData) => {
  return callAIService("/api/v1/ingestion/note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateIngestNoteToAI = async (data: NoteAIData) => {
  return callAIService("/api/v1/ingestion/note", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteIngestNoteEmbeddings = async (data: DeleteNoteAIData) => {
  return callAIService("/api/v1/ingestion/note", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const chatWithAI = async (data: ChatAIData) => {
  return callAIService("/api/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
