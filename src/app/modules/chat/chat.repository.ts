/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chat } from "./chat.model";
import { IChat } from "./chat.interface";

const findUserChat = (userId: string) => {
  return Chat.findOne({ userId }).sort({ createdAt: -1 });
};

const createChat = (payload: Partial<IChat>) => {
  return Chat.create(payload);
};

const addMessage = (chatId: string, message: any) => {
  return Chat.findByIdAndUpdate(
    chatId,
    { $push: { messages: message } },
    { new: true }
  );
};

const assignManager = (chatId: string, managerId: string) => {
  return Chat.findByIdAndUpdate(
    chatId,
    {
      managerId,
      status: "HUMAN",
    },
    { new: true }
  );
};

export const ChatRepository = {
  findUserChat,
  createChat,
  addMessage,
  assignManager,
};