import { Types } from "mongoose";

export enum ChatSender {
  USER = "USER",
  AI = "AI",
  MANAGER = "MANAGER",
}

export enum ChatStatus {
  BOT = "BOT",
  HUMAN = "HUMAN",
  CLOSED = "CLOSED",
}

export interface IChat {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;

  managerId?: Types.ObjectId | null;

  status: ChatStatus;

  lastMessage?: string;

  lastMessageAt?: Date;

  aiResolved?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  _id?: Types.ObjectId;

  chatId: Types.ObjectId;

  sender: ChatSender;

  message: string;

  read: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}