import { Schema, model, Types } from "mongoose";
import { ChatSender, ChatStatus, IChat } from "./chat.interface";

const messageSchema = new Schema(
  {
    sender: {
      type: String,
      enum: Object.values(ChatSender),
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    managerId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(ChatStatus),
      default: ChatStatus.BOT,
    },

    aiResolved: {
      type: Boolean,
      default: false,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", chatSchema);