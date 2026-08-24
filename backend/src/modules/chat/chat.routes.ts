import { Router } from "express";

import chatController from "./chat.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", AuthMiddleware, chatController.chatController);

router.get(
  "/messages",
  AuthMiddleware,
  chatController.getChatMessagesController,
);

export default router;
