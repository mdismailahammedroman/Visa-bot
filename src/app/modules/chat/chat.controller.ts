/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { ChatRepository } from "./chat.repository";
import { sendUserMessage } from "./chat.service";
import { CatchAsync } from "../../utils/CatchAsync";

const sendMessage = CatchAsync(async (req: Request, res: Response) => {

  const user = req.user as any;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const result = await sendUserMessage(user._id.toString(), message);

  res.status(200).json({
    success: true,
    data: result,
  });

});

const getMyChats = CatchAsync(async (req: Request, res: Response) => {

  const user = req.user as any;

  const chat = await ChatRepository.findUserChat(user._id.toString());

  res.status(200).json({
    success: true,
    data: chat,
  });

});

const getChatMessages = CatchAsync(async (req: Request, res: Response) => {

  const user = req.user as any;
  const { chatId } = req.params;

  const chat = await ChatRepository.findChatById(chatId as string);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  const isOwner = chat.userId.toString() === user._id.toString();
  const isManager = chat.managerId?.toString() === user._id.toString();
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isManager && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const page = Number(req.query.page) || 1;

  const result = await ChatRepository.getMessages(chatId as string, page);

  res.status(200).json({
    success: true,
    meta: result.meta,
    data: result.data,
  });

});

const markMessagesRead = CatchAsync(async (req: Request, res: Response) => {

  const { chatId } = req.params;

  await ChatRepository.markMessagesAsRead(chatId as string);

  res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });

});

export const ChatController = {
  sendMessage,
  getMyChats,
  getChatMessages,
  markMessagesRead,
};