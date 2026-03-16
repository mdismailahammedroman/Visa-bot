import { Schema, model, Types } from "mongoose";
import { ChatStatus, IChat } from "./chat.interface";

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
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ChatStatus),
      default: ChatStatus.BOT,
      index: true,
    },

    lastMessage: {
      type: String,
      trim: true,
    },

    lastMessageAt: {
      type: Date,
      index: true,
    },

    aiResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * performance indexes
 */

chatSchema.index({ createdAt: -1 });

chatSchema.index({ managerId: 1, status: 1 });

export const ChatModel = model<IChat>("Chat", chatSchema);