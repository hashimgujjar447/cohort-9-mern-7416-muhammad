import { Request, Response } from "express";

import chatService from "./chat.service.js";

class ChatController {
  async chatController(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is required",
      });
    }

    const { query } = req.body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const result = await chatService.chatService({
      query: query.trim(),
      userId: req.user.userId,
    });

    return res.status(result.status).json(result);
  }

  async getChatMessagesController(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is required",
      });
    }

    const result = await chatService.getChatMessagesService({
      userId: req.user.userId,
    });

    return res.status(result.status).json(result);
  }
}

export default new ChatController();
