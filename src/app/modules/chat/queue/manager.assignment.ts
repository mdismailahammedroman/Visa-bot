import { ChatRepository } from "../chat.repository";
import { ChatStatus } from "../chat.interface";
import { getNextManager } from "./manager.queue";

export const assignManagerToChat = async (chatId: string) => {

  const managerId = await getNextManager();

  if (!managerId) {
    return null;
  }

  const chat = await ChatRepository.updateChat(chatId, {
    managerId,
    status: ChatStatus.HUMAN,
  });

  return {
    managerId,
    chat,
  };
};