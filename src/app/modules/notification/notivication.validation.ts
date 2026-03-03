import { z } from "zod";

export const markReadZodSchema = z.object({
  body: z.object({
    notificationId: z.string().min(1),
  }),
});