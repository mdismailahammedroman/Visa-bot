/* eslint-disable @typescript-eslint/no-explicit-any */
// visaService.validation.ts
import { z } from "zod";
import { VisaCategoryEnum, VisaTypeEnum } from "./visaService.interface";

// Helper to normalize lowercase/mixed-case to proper enum
const normalizeEnum = (val: string | undefined, enumObj: any) => {
  if (!val) return undefined;
  const upperVal = val.toUpperCase().replace(/ /g, "_");
  if (!Object.values(enumObj).includes(upperVal)) {
    throw new Error(`Invalid value: ${val}`);
  }
  return upperVal;
};

export const createVisaServiceZodSchema = z.object({
  body: z.object({
    serviceName: z.string().min(2),
    slug: z.string().min(2).optional(),

    visaCategories: z
      .string()
      .transform((val) => normalizeEnum(val, VisaCategoryEnum)),

    visaType: z.string().transform((val) => normalizeEnum(val, VisaTypeEnum)),

    description: z.string().optional(),
    currency: z.string().optional(),
    maxStayDays: z.number().optional(),

    eligibleFor: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    processingTimeDays: z.number().optional(),
    visaFee: z.number().optional(),
    serviceFee: z.number().optional(),
    totalFee: z.number().optional(),
    multipleEntries: z.boolean().optional(),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateVisaServiceZodSchema = z.object({
  body: z.object({
    serviceName: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),

    visaCategories: z.string().transform((val) => normalizeEnum(val, VisaCategoryEnum)).optional(),
    visaType: z.string().transform((val) => normalizeEnum(val, VisaTypeEnum)).optional(),

    description: z.string().optional(),
    currency: z.string().optional(),
    maxStayDays: z.number().optional(),

    eligibleFor: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    processingTimeDays: z.number().optional(),
    visaFee: z.number().optional(),
    serviceFee: z.number().optional(),
    totalFee: z.number().optional(),
    multipleEntries: z.boolean().optional(),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});