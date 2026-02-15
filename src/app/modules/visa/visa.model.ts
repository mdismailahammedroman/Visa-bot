// src/modules/visa/visa.model.ts
import { Schema, model } from "mongoose";
import { IVisaApplication } from "./visa.interface";

const FileSchema = new Schema(
  {
    field: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const VisaApplicationSchema = new Schema<IVisaApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    countryId: { type: String },
    destinationId: { type: String },

    serviceTypeId: { type: String },
    visaTypeId: { type: String },

    fee: {
      amount: { type: Number },
      currency: { type: String, enum: ["BDT", "USD"] },
      breakdown: { type: Schema.Types.Mixed },
    },

    personalInfo: {
      fullName: { type: String },
      gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
      dateOfBirth: { type: String },
      passportNumber: { type: String },
      phone: { type: String },
      email: { type: String },
      address: { type: String },
    },

    financialInfo: {
      occupationType: {
        type: String,
        enum: ["BUSINESS", "FREELANCE", "EMPLOYED", "STUDENT", "OTHER"],
      },
      bankName: { type: String },
      accountNumber: { type: String },
      bankStatementFileUrl: { type: String },
    },

    travelInfo: {
      travelMode: {
        type: String,
        enum: ["SELF", "FRIEND_FAMILY", "EMPLOYEE", "BUSINESS_TRAVEL"],
      },
      note: { type: String },
    },

    files: { type: [FileSchema], default: [] },

    currentStep: {
      type: String,
      enum: [
        "COUNTRY_DESTINATION",
        "SERVICE_VISA",
        "FEE",
        "PERSONAL",
        "FINANCIAL",
        "TRAVEL",
        "REVIEW_SUBMIT",
      ],
      default: "COUNTRY_DESTINATION",
    },

    completedSteps: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "PAYMENT_PENDING",
        "PAID",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
      ],
      default: "DRAFT",
    },
  },
  { timestamps: true },
);

// Helpful indexes
VisaApplicationSchema.index({ userId: 1, createdAt: -1 });

export const VisaApplicationModel = model<IVisaApplication>(
  "VisaApplication",
  VisaApplicationSchema,
);
