/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";

import { ChatRepository } from "./chat.repository";
import { ChatSender } from "./chat.interface";
import { assignManagerToChat } from "./queue/manager.assignment";

import { getIo } from "../socket/socket.store";
import { generateAIReply } from "./AI/ai.agent";

export const sendUserMessage = async (
  userId: string,
  message: string
) => {

  let chat = await ChatRepository.findUserChat(userId);

  if (!chat) {
    chat = await ChatRepository.createChat({
      userId: new Types.ObjectId(userId),
    });
  }

  const chatId = chat._id.toString();

  const userMsg = await ChatRepository.createMessage({
    chatId: chat._id,
    sender: ChatSender.USER,
    message,
    read: false,
  });

  await ChatRepository.updateChat(chatId, {
    lastMessage: message,
    lastMessageAt: new Date(),
  });

  const io = getIo();

  io.to(`chat_${chatId}`).emit("new-message", userMsg);

  if (chat.managerId) {

    io.to(`user_${chat.managerId}`).emit("manager-new-message", {
      chatId,
      message: userMsg,
    });

    return userMsg;
  }

  const ai = await generateAIReply(userId, message);

  if (ai.escalate) {

    const assigned = await assignManagerToChat(chatId);

    const aiMsg = await ChatRepository.createMessage({
      chatId: chat._id,
      sender: ChatSender.AI,
      message: "Connecting you with a manager...",
      read: false,
    });

    await ChatRepository.updateChat(chatId, {
      lastMessage: aiMsg.message,
      lastMessageAt: new Date(),
    });

    io.to(`chat_${chatId}`).emit("new-message", aiMsg);

    io.to(`user_${assigned.managerId}`).emit("manager-new-chat", {
      chat: assigned.chat,
    });

    return aiMsg;
  }

  const aiMsg = await ChatRepository.createMessage({
    chatId: chat._id,
    sender: ChatSender.AI,
    message: ai.reply,
    read: false,
  });

  await ChatRepository.updateChat(chatId, {
    lastMessage: ai.reply,
    lastMessageAt: new Date(),
  });

  io.to(`chat_${chatId}`).emit("new-message", aiMsg);

  return aiMsg;
};