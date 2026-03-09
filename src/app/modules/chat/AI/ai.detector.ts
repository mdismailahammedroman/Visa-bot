export const detectHumanSupport = (userMessage: string, aiReply: string) => {

  const lower = userMessage.toLowerCase();

  const keywords = [
    "manager",
    "human",
    "agent",
    "support",
    "talk to someone",
  ];

  const userAskedHuman = keywords.some((k) => lower.includes(k));

  const aiCannotAnswer =
    aiReply.toLowerCase().includes("i don't have the information");

  return userAskedHuman || aiCannotAnswer;
};