import { z } from "zod";
import { GENDER_TYPE } from "./user.interface";

export const registerUserZodSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),

      profile_picture: z.url().optional(),

      coverPicture: z.url().optional(),

      gender: z.enum(GENDER_TYPE).optional(),

      mobile: z.string().optional(), 

      location: z.string().optional(), 
    })
    .strict(), 
});
