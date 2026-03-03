import { z } from "zod";
import { GENDER_TYPE } from "../user/user.interface";

export const createVisaApplicationZodSchema = z.object({
  body: z.object({
    fromCountryName: z.string().min(2),
    countryId: z.string().min(1),
    fullName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    birthDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    passportNumber: z.string().min(6),
    gender: z.enum(Object.values(GENDER_TYPE)),
    incomeSource: z.enum([
      "Self Funded",
      "Friend or Family",
      "Employee Business Travel",
    ]),
    monthlyIncome: z.coerce.number().min(0),
    bankName: z.string().min(2),
    accountNumber: z.string().optional(),
    visaFee: z.coerce.number().optional(),
    serviceFee: z.coerce.number().optional(),
    totalFee: z.coerce.number().optional(),
    paymentStatus: z.enum(["Unpaid", "Paid", "Refunded"]).optional(),
    status: z
      .enum(["Pending", "Processing", "Approved", "Rejected"])
      .optional(),
    passportCopy: z.string().min(1).optional(),
    passportPhoto: z.string().min(1).optional(),
    oldVisaCopy: z.string().min(1).optional(),
    bankStatement: z.string().optional(),
  }),
});