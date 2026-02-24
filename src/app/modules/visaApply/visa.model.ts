import { Schema, model } from "mongoose";
import { IVisaApplication } from "./visa.interface";
import {
  ApplicationStatus,
  IncomeSource,
  PaymentStatus,
} from "./visa.interface";
import { GENDER_TYPE } from "../user/user.interface";

const visaApplicationSchema = new Schema<IVisaApplication>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visaServiceId: {
      type: Schema.Types.ObjectId,
      ref: "VisaService",
      required: true,
      index: true,
    },

    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true,
    },

    isDraft: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ========================
    // Personal Information
    // ========================

    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true },
    birthDate: { type: Date },
    passportNumber: { type: String, trim: true },

    gender: {
      type: String,
      enum: Object.values(GENDER_TYPE),
    },

    visaType: { type: String, trim: true },

    // ========================
    // Financial Information
    // ========================

    incomeSource: {
      type: String,
      enum: Object.values(IncomeSource),
    },

    monthlyIncome: { type: Number },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    bankStatement: { type: String },

    // ========================
    // Documents (S3 URLs)
    // ========================

    passportCopy: { type: String },
    passportPhoto: { type: String },
    oldVisaCopy: { type: String },

    // ========================
    // Fees
    // ========================

    visaFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 },

    // ========================
    // Payment
    // ========================

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },

    // ========================
    // Application Status
    // ========================

    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.DRAFT,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
visaApplicationSchema.index({ userId: 1, createdAt: -1 });
visaApplicationSchema.index({ visaServiceId: 1, createdAt: -1 });
visaApplicationSchema.index({ trackingId: 1 });
visaApplicationSchema.index({ status: 1 });
visaApplicationSchema.index({ paymentStatus: 1 });

export const VisaApplicationModel = model<IVisaApplication>(
  "VisaApplication",
  visaApplicationSchema,
);
