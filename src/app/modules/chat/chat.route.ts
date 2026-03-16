import { Router } from "express";
import { ChatController } from "./chat.controller";

import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

/**
 * Send message
 */

router.post(
  "/send",
  checkAuth(...Object.values(Role)),
  ChatController.sendMessage
);

/**
 * My chat
 */

router.get(
  "/my-chat",
  checkAuth(...Object.values(Role)),
  ChatController.getMyChats
);

/**
 * Chat messages
 */

router.get(
  "/messages/:chatId",
  checkAuth(...Object.values(Role)),
  ChatController.getChatMessages
);

/**
 * Mark read
 */

router.patch(
  "/read/:chatId",
  checkAuth(...Object.values(Role)),
  ChatController.markMessagesRead
);

export const chatRoute = router;