import { ChatRepository } from "./chat.repository";
import { ChatSender } from "./chat.interface";
import { getIo } from "../socket/socket.store";
import { generateAIReply, getAvailableManager } from "./ai.agent";
import { Types } from "mongoose";

const sendMessage = async (userId: string, message: string) => {

  let chat = await ChatRepository.findUserChat(userId);

  if (!chat) {
    chat = await ChatRepository.createChat({
      userId: new Types.ObjectId(userId),
      messages: [],
    });
  }

  // user message save
  await ChatRepository.addMessage(chat._id.toString(), {
    sender: ChatSender.USER,
    message,
  });

  // AI reply generate
  const aiReply = await generateAIReply(userId, message);

  const lower = message.toLowerCase();

  const needHuman =
    lower.includes("manager") ||
    lower.includes("agent") ||
    lower.includes("support") ||
    aiReply.toLowerCase().includes("manager");

  // ---------------------- AI reply ----------------------

  if (!needHuman) {

    const updated = await ChatRepository.addMessage(chat._id.toString(), {
      sender: ChatSender.AI,
      message: aiReply,
    });

    return updated;
  }

  // ---------------------- Manager assignment ----------------------

  let managerId;

  try {
    managerId = await getAvailableManager();
  } catch {

    await ChatRepository.addMessage(chat._id.toString(), {
      sender: ChatSender.AI,
      message: "Currently no manager is online. Please try again later.",
    });

    return chat;
  }

  await ChatRepository.addMessage(chat._id.toString(), {
    sender: ChatSender.AI,
    message: "Connecting you with a manager...",
  });

  const assigned = await ChatRepository.assignManager(
    chat._id.toString(),
    managerId
  );

  const io = getIo();

  io.to(`chat_${managerId}`).emit("newChat", assigned);

  return assigned;
};

export const ChatService = {
  sendMessage,
};