// src/modules/visaService/visaService.validation.ts
import { z } from "zod";
import { VisaCategoryEnum, VisaTypeEnum } from "./visaService.interface";

const VisaCategoryItemZod = z.object({
  category: z.enum([
    "Tourist",
    "Business",
    "Student",
    "Work",
    "Investor",
    "Medical",
    "Diplomatic",
    "Other",
  ]),
  visaType: z.enum([
    "Visa-Free",
    "Visa on Arrival",
    "eVisa",
    "Embassy Required",
    "Restricted",
  ]),
  maxStayDays: z.number().optional(),
  applicationLink: z.string().url().optional(),
  eligibleFor: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  processingTimeDays: z.number().optional(),
  fees: z.number().optional(),
  multipleEntries: z.boolean().optional(),
  notes: z.string().optional(),
});

export const createVisaServiceZodSchema = z.object({
 body: z.object({
   
    serviceName: z.string().min(2),
    slug: z.string().min(2).optional(),

    description: z.string().optional(),
    currency: z.string().optional(),

    visaCategories: z.nativeEnum(VisaCategoryEnum),
    visaType: z.nativeEnum(VisaTypeEnum),

    maxStayDays: z.number().optional(),
    applicationLink: z.string().url().optional(),

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
    currency: z.enum(["BDT", "USD"]).optional(),
    visaCategories: z.array(VisaCategoryItemZod).min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});
