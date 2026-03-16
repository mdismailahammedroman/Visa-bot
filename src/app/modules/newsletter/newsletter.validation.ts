import { z } from "zod";

export const subscribeSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const campaignSchema = z.object({
  body: z.object({
    title: z.string(),
    subject: z.string(),
    content: z.string(),
  }),
});