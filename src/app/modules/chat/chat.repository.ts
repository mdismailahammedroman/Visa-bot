/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";
import { ChatModel } from "./chat.model";
import { MessageModel } from "./message.model";
import { IMessage } from "./chat.interface";

const findUserChat = async (userId: string) => {
  return ChatModel.findOne({ userId }).sort({ createdAt: -1 });
};

const findChatById = async (chatId: string) => {
  return ChatModel.findById(chatId);
};

const createChat = async (payload: any) => {
  return ChatModel.create(payload);
};

const updateChat = async (chatId: string, payload: any) => {
  return ChatModel.findByIdAndUpdate(chatId, payload, { new: true });
};

const createMessage = async (payload: IMessage) => {
  return MessageModel.create(payload);
};

const getMessages = async (chatId: string, page = 1, limit = 30) => {

  const skip = (page - 1) * limit;

  const messages = await MessageModel.find({
    chatId: new Types.ObjectId(chatId),
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await MessageModel.countDocuments({
    chatId: new Types.ObjectId(chatId),
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: messages.reverse(),
  };
};

const markMessagesAsRead = async (chatId: string) => {
  return MessageModel.updateMany(
    { chatId: new Types.ObjectId(chatId), read: false },
    { read: true }
  );
};

export const ChatRepository = {
  findUserChat,
  findChatById,
  createChat,
  updateChat,
  createMessage,
  getMessages,
  markMessagesAsRead,
};