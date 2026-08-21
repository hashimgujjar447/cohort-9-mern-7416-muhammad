import { chatWithAI } from "../../services/ai.service.js";
import { serviceResponse } from "../../utils/apiResponse.js";
import { ChatMessage } from "./chat.models.js";

class ChatService {
  async chatService(data: { query: string; userId: string }) {
    try {
      const history = await ChatMessage.find(
        {
          user: data.userId,
        },
        {
          _id: 0,
          role: 1,
          content: 1,
        },
      )
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      history.reverse();

      const response = await chatWithAI({
        query: data.query,
        userId: data.userId,
        history,
      });

      const aiResponse = response.response;

      await ChatMessage.create({
        user: data.userId,
        role: "user",
        content: data.query,
      });

      await ChatMessage.create({
        user: data.userId,
        role: "assistant",
        content: aiResponse,
      });

      const messages = await ChatMessage.find(
        {
          user: data.userId,
        },
        {
          _id: 0,
          role: 1,
          content: 1,
          createdAt: 1,
        },
      )
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      messages.reverse();

      return serviceResponse(
        200,
        true,
        "Chat response generated successfully",
        {
          response: aiResponse,
          messages,
        },
      );
    } catch (error) {
      console.error("Chat service error:", error);

      return serviceResponse(500, false, "Failed to generate chat response");
    }
  }

  async getChatMessagesService(data: { userId: string }) {
    try {
      const messages = await ChatMessage.find(
        {
          user: data.userId,
        },
        {
          _id: 0,
          role: 1,
          content: 1,
          createdAt: 1,
        },
      )
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      messages.reverse();

      return serviceResponse(200, true, "Chat messages fetched successfully", {
        messages,
      });
    } catch (error) {
      console.error("Get chat messages error:", error);

      return serviceResponse(500, false, "Failed to fetch chat messages");
    }
  }
}

export default new ChatService();
