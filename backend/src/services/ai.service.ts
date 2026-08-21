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

type ChatAIResponse = {
  response: string;
};

const AI_TIMEOUT_MS = 30_000;

const callAIService = async (endpoint: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(`${process.env.AI_SERVICE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `AI service failed: ${response.status} - ${errorMessage}`,
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("AI service request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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

export const chatWithAI = async (data: ChatAIData): Promise<ChatAIResponse> => {
  const result = await callAIService("/api/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!result || typeof result.response !== "string") {
    throw new Error("AI service returned an unexpected response shape");
  }

  return result as ChatAIResponse;
};
