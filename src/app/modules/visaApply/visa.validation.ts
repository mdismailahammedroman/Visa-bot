// src/modules/visa/visa.validation.ts
import { z } from "zod";

export const createDraftSchema = z.object({
  body: z.object({}).optional(),
});

export const stepCountryDestinationSchema = z.object({
  body: z.object({
    countryId: z.string().min(1),
    destinationId: z.string().min(1),
  }),
});

export const stepServiceVisaSchema = z.object({
  body: z.object({
    serviceTypeId: z.string().min(1),
    visaTypeId: z.string().min(1),
  }),
});

export const stepFeeSchema = z.object({
  body: z.object({
    amount: z.number().min(0),
    currency: z.enum(["BDT", "USD"]),
    breakdown: z.record(z.string(), z.number()).optional(),
  }),
});

export const stepPersonalSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    dateOfBirth: z.string().optional(),
    passportNumber: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
  }),
});

export const stepFinancialSchema = z.object({
  body: z.object({
    incomeSource: z.enum([
      "Self funded trip",
      "Friend or family",
      "Employee business travel",
    ]),
    monthlyIncome: z.number().min(0).optional(),
    bankName: z.string().min(2),
    accountNumber: z.string().min(6),
    bankStatement: z.string().url(),
  }),
});

export const stepTravelSchema = z.object({
  body: z.object({
    travelMode: z.enum([
      "SELF",
      "FRIEND_FAMILY",
      "EMPLOYEE",
      "BUSINESS_TRAVEL",
    ]),
    note: z.string().optional(),
  }),
});

export const submitSchema = z.object({
  body: z.object({}).optional(),
});
