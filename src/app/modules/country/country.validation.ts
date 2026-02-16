// src/modules/country/country.validation.ts
import { z } from "zod";
import { validContinents, validCurrencies } from "./country.interface";

export const createCountryZodSchema = z.object({
  body: z.object({
    countryName: z.string().min(2),
    isoCode: z
      .string()
      .min(2)
      .max(3)
      .regex(/^[A-Z]+$/, "ISO code must be uppercase letters"),
    continent: z
      .string()
      .transform((val) =>
        val.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
      )
      .refine((val) => (validContinents as readonly string[]).includes(val), {
        message: "Invalid continent",
      }),
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
      .regex(/^[A-Z]+$/, "ISO code must be uppercase letters")
      .optional(),
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
