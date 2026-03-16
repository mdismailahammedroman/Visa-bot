import { Schema, model, Types } from "mongoose";
import { IMessage, ChatSender } from "./chat.interface";

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: String,
      enum: Object.values(ChatSender),
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: -1, read: 1 });

export const MessageModel = model<IMessage>("Message", messageSchema);