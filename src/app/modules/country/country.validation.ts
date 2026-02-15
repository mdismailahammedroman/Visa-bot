// src/modules/country/country.validation.ts

import { z } from "zod";

export const createCountryZodSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().length(2),
    flag: z.string().url().optional(),
  }),
});
