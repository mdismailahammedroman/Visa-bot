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

export interface IMessage {
  sender: ChatSender;
  message: string;
  createdAt?: Date;
}

export interface IChat {
  userId: Types.ObjectId;

  managerId?: Types.ObjectId | null;

  status: ChatStatus;

  messages: IMessage[];

  aiResolved?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}