// src/modules/country/country.validation.ts
import { z } from "zod";

export const createCountryZodSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    isoCode: z.string().min(2).max(3),
    continent: z.string().min(2),

    capital: z.string().optional(),
    flagUrl: z.url().optional(),
    currency: z.string().optional(),
    languages: z.array(z.string()).optional(),
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
    name: z.string().min(2).optional(),
    isoCode: z.string().min(2).max(3).optional(),
    continent: z.string().min(2).optional(),

    capital: z.string().optional(),
    flagUrl: z.url().optional(),
    currency: z.string().optional(),
    languages: z.array(z.string()).optional(),
    timeZones: z.array(z.string()).optional(),
    population: z.number().optional(),
    popularCities: z.array(z.string()).optional(),
    callingCode: z.string().optional(),
    travelAdvisory: z.string().optional(),
    notes: z.string().optional(),
  }),
});
