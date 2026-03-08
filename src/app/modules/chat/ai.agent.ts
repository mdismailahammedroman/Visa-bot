/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import { redisClient } from "../../config/redis.config";
import { VisaApplicationModel } from "../visaApply/visa.model";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ---------------------- Generate AI Reply ----------------------
export const generateAIReply = async (userId: string, message: string) => {
  // Fetch user visa applications
// Visa applications
const applications = await VisaApplicationModel.find({ userId })
  .populate("countryId visaServiceId");

// Payment history
const payments = await PaymentModel.find({ userId })
  .populate("applicationId");

  const appSummary = applications.map(app => {
  const country = (app.countryId as any)?.countryName || "Unknown";
  const service = (app.visaServiceId as any)?.serviceName || "Unknown";
  return `TrackingId: ${app.trackingId}, Country: ${country}, Service: ${service}, Status: ${app.status}, Total Fee: ${app.totalFee}`;
}).join("\n") || "No visa applications found.";

const paymentSummary = payments.map(p => {
  const service = (p.applicationId as any)?.visaServiceId?.serviceName || "Unknown";
  return `PaymentId: ${p.paymentIntentId}, Amount: ${p.amount} ${p.currency}, Status: ${p.status}, For Service: ${service}`;
}).join("\n") || "No payment history found.";

  // AI system prompt
  const completion = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `
You are an AI assistant for a visa application system.
You can only use the user's data provided below.
Do NOT use any general knowledge.

User's Visa Applications:
${appSummary}

User's Payment History:
${paymentSummary}

Answer the user's question ONLY based on this data.
If you cannot answer from this data, respond: "I don't have the information. Connecting you with a manager."
Respond in English.
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
    return "Sorry, I couldn't understand. Connecting you with a manager.";
  }

  return reply;
};

// ---------------------- Get Available Manager ----------------------
export const getAvailableManager = async () => {
  const manager = await redisClient.lPop("managerQueue");

  if (!manager) throw new Error("No manager online");

  // Push back to queue so manager stays available
  await redisClient.rPush("managerQueue", manager);
  return manager;
};
