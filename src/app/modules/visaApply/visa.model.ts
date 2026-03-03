import { Schema, model } from "mongoose";

import {
  ApplicationStatus,
  IncomeSource,
  IVisaApplication,
  PaymentStatus,
} from "./visa.interface";
import { GENDER_TYPE } from "../user/user.interface";

const visaApplicationSchema = new Schema<IVisaApplication>(
  {
    trackingId: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fromCountryName: {
      type: String,
      trim: true,
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true,
    },
    visaServiceId: {
      type: Schema.Types.ObjectId,
      ref: "VisaService",
      required: true,
      index: true,
    },

    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true },
    birthDate: { type: Date },
    passportNumber: { type: String, trim: true },
    gender: { type: String, enum: Object.values(GENDER_TYPE) },
    visaType: { type: String, trim: true },
    incomeSource: { type: String, enum: Object.values(IncomeSource) },
    monthlyIncome: { type: Number },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    bankStatement: { type: String },
    passportCopy: { type: String },
    passportPhoto: { type: String },
    oldVisaCopy: { type: String },

    visaFee: { type: Number },
    serviceFee: { type: Number },
    totalFee: { type: Number },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false },
);

visaApplicationSchema.index({ trackingId: 1 }, { unique: true });

export const VisaApplicationModel = model<IVisaApplication>(
  "VisaApplication",
  visaApplicationSchema,
);
