
import OpenAI from "openai";

import { envVar } from "../../../config/EnvVar";

import { getUserAIContext } from "./ai.context";
import { detectHumanSupport } from "./ai.detector";

const openai = new OpenAI({
  apiKey: envVar.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateAIReply = async (
  userId: string,
  message: string
) => {

  const context = await getUserAIContext(userId);

  const completion = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content: `
You are a support AI for a visa processing system.

You can ONLY answer using the user data below.

User Visa Applications:
${context.applications}

User Payment History:
${context.payments}

Rules:
- Do not use general knowledge.
- Only answer from the provided data.
- If the answer is not available say:
"I don't have the information. Connecting you with a manager."
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const reply = completion.choices?.[0]?.message?.content;

  if (!reply) {
    return {
      reply: "Sorry, I couldn't understand. Connecting you with a manager.",
      escalate: true,
    };
  }

  const escalate = detectHumanSupport(message, reply);

  return {
    reply,
    escalate,
  };
};