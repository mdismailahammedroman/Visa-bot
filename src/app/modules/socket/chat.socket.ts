/* eslint-disable @typescript-eslint/no-explicit-any */

import { Server, Socket } from "socket.io";

import { sendUserMessage } from "../chat/chat.service";
import { ChatRepository } from "../chat/chat.repository";
import { ChatSender } from "../chat/chat.interface";
import { checkChatRateLimit } from "../chat/chat.rateLimit";
import { sanitizeMessage, validateChatMessage } from "../chat/chat.security";
import { trackManagerReply } from "../chat/chat.metrics";

export const chatSocket = (io: Server, socket: Socket) => {

  const user = socket.data.user;

  console.log("💬 Chat module ready:", socket.id, user?.role);

  /**
   * USER JOIN PERSONAL ROOM
   */

  socket.on("join-user-room", () => {

    if (!user?._id) return;

    socket.join(`user_${user._id}`);

  });

  /**
   * JOIN CHAT ROOM
   */

  socket.on("join-chat", async (chatId: string) => {

    try {

      if (!chatId) return;

      const chat = await ChatRepository.findChatById(chatId);

      if (!chat) return;

      socket.join(`chat_${chatId}`);

      console.log(`${socket.id} joined chat_${chatId}`);

    } catch (error) {

      console.error("join-chat error:", error);

    }

  });

  /**
   * LEAVE CHAT
   */

  socket.on("leave-chat", (chatId: string) => {

    if (!chatId) return;

    socket.leave(`chat_${chatId}`);

  });

  /**
   * USER SEND MESSAGE
   */

socket.on("user-message", async ({ message }) => {
  try {

    if (!user?._id) return;

    // rate limit
    await checkChatRateLimit(user._id);

    if (!validateChatMessage(message)) {
      return socket.emit("chat-error", {
        message: "Invalid message",
      });
    }

    const safeMessage = sanitizeMessage(message);

    await sendUserMessage(user._id, safeMessage);

  } catch (error) {

    console.error("user-message error:", error);

    socket.emit("chat-error", {
      message: "Failed to send message",
    });

  }
});
  /**
   * MANAGER SEND MESSAGE
   */

  socket.on("manager-message", async (data) => {

    try {

      if (user?.role !== "MANAGER") return;

      const { chatId, message } = data;

      if (!chatId || !message) return;

      const chat = await ChatRepository.findChatById(chatId);

      if (!chat) return;

const msg = await ChatRepository.createMessage({
  chatId: chat._id,
  sender: ChatSender.MANAGER,
  message,
  read: false,
});

await trackManagerReply(user._id);

io.to(`chat_${chatId}`).emit("new-message", msg);

    } catch (error) {

      console.error("manager-message error:", error);

      socket.emit("chat-error", {
        message: "Failed to send manager message",
      });

    }

  });

  /**
   * TYPING INDICATOR
   */

  socket.on("typing-start", ({ chatId }) => {

    if (!chatId) return;

    socket.to(`chat_${chatId}`).emit("typing-start", {
      userId: user?._id,
    });

  });

  socket.on("typing-stop", ({ chatId }) => {

    if (!chatId) return;

    socket.to(`chat_${chatId}`).emit("typing-stop", {
      userId: user?._id,
    });

  });

  /**
   * MESSAGE SEEN
   */

  socket.on("message-seen", async ({ chatId }) => {

    try {

      if (!chatId) return;

      await ChatRepository.markMessagesAsRead(chatId);

      socket.to(`chat_${chatId}`).emit("message-seen", {
        chatId,
        userId: user?._id,
      });

    } catch (error) {

      console.error("message-seen error:", error);

    }

  });

};