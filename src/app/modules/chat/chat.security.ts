export const validateChatMessage = (message: string) => {

  if (!message) return false;

  const trimmed = message.trim();

  if (!trimmed) return false;

  if (trimmed.length > 2000) return false;

  // block script injection
  if (trimmed.toLowerCase().includes("<script")) return false;

  return true;

};

export const sanitizeMessage = (message: string) => {

  return message
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n{3,}/g, "\n\n"); // prevent newline spam

};