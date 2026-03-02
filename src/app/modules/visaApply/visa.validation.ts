import { z } from "zod";
import { GENDER_TYPE } from "../user/user.interface";

export const createVisaApplicationZodSchema = z.object({
  body: z.object({
    countryId: z.string().min(1),
    fullName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    birthDate: z.string().min(10),
    passportNumber: z.string().min(6),
    gender: z.enum(Object.values(GENDER_TYPE)),
    incomeSource: z.enum([
      "Self Funded",
      "Friend or Family",
      "Employee Business Travel",
    ]),
    monthlyIncome: z.coerce.number().min(0), // coerce string -> number
    bankName: z.string().min(2),
    accountNumber: z.string().optional(),
    visaFee: z.coerce.number().optional(),
    serviceFee: z.coerce.number().optional(),
    totalFee: z.coerce.number().optional(),
    paymentStatus: z.enum(["Unpaid", "Paid", "Refunded"]).optional(),
    status: z
      .enum(["Pending", "Processing", "Approved", "Rejected"])
      .optional(),
  }),
});

export const updateVisaApplicationZodSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(10).optional(),
    birthDate: z.string().min(10).optional(),
    passportNumber: z.string().min(6).optional(),
    gender: z.enum(Object.values(GENDER_TYPE)).optional(),
    incomeSource: z
      .enum(["Self Funded", "Friend or Family", "Employee Business Travel"])
      .optional(),
    monthlyIncome: z.number().min(0).optional(),
    bankName: z.string().min(2).optional(),
    accountNumber: z.string().min(6).optional(),
    bankStatement: z.string().optional(),
    passportCopy: z.string().min(1).optional(),
    passportPhoto: z.string().min(1).optional(),
    oldVisaCopy: z.string().min(1).optional(),
    visaFee: z.number().optional(),
    serviceFee: z.number().optional(),
    totalFee: z.number().optional(),
    paymentStatus: z.enum(["Unpaid", "Paid", "Refunded"]).optional(),
    status: z
      .enum(["Pending", "Processing", "Approved", "Rejected"])
      .optional(),
  }),
});
