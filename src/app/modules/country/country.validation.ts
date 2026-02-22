import { z } from "zod";
import { validContinents, validCurrencies } from "./country.interface";

export const createCountryZodSchema = z.object({
  body: z.object({
    countryName: z.string().min(2),

    isoCode: z
      .string()
      .min(2)
      .max(3)
      .transform((val) => val.toUpperCase())
      .refine((val) => /^[A-Z]+$/.test(val), {
        message: "ISO code must contain only letters",
      }),

    continent: z.enum(validContinents),

    capital: z.string().optional(),
    flagUrl: z.string().url().optional(),
    currency: z.enum(validCurrencies).optional(),
    timeZones: z.array(z.string()).optional(),
    population: z.number().optional(),
    popularCities: z.array(z.string()).optional(),
    callingCode: z.string().optional(),
    travelAdvisory: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateCountryZodSchema = z.object({
  body: z.object({
    countryName: z.string().min(2).optional(),
    isoCode: z
      .string()
      .min(2)
      .max(3)
      .transform((val) => val.toUpperCase())
      .refine((val) => /^[A-Z]+$/.test(val), {
        message: "ISO code must contain only letters",
      }),

    continent: z.enum(validContinents).optional(),
    capital: z.string().optional(),
    flagUrl: z.string().url().optional(),
    currency: z.enum(validCurrencies).optional(),
    timeZones: z.array(z.string()).optional(),
    population: z.number().optional(),
    popularCities: z.array(z.string()).optional(),
    callingCode: z.string().optional(),
    travelAdvisory: z.string().optional(),
    notes: z.string().optional(),
  }),
});
