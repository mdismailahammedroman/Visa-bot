import { z } from "zod";
import { VisaCategoryEnum, VisaTypeEnum } from "./visaService.interface";

export const createVisaServiceZodSchema = z.object({
  body: z.object({
    serviceName: z.string().min(2),
    slug: z.string().min(2).optional(),

    visaCategories: z
      .enum(VisaCategoryEnum)
      .transform((val) => val.toLowerCase()),

    visaType: z.enum(VisaTypeEnum).transform((val) => val.toLowerCase()),

    description: z.string().optional(),
    currency: z.string().optional(),
    maxStayDays: z.number().optional(),

    eligibleFor: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    processingTimeDays: z.number().optional(),
    fees: z.number().optional(),
    multipleEntries: z.boolean().optional(),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateVisaServiceZodSchema = z.object({
  body: z.object({
    serviceName: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    currency: z.string().optional(),

    visaCategories: z.nativeEnum(VisaCategoryEnum).optional(),
    visaType: z.nativeEnum(VisaTypeEnum).optional(),

    maxStayDays: z.number().optional(),

    eligibleFor: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    processingTimeDays: z.number().optional(),
    fees: z.number().optional(),
    multipleEntries: z.boolean().optional(),
    notes: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
