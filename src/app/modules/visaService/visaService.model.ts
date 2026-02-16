// src/modules/visaService/visaService.model.ts
import { Schema, model } from "mongoose";
import { IVisaService } from "./visaService.interface";

const VisaCategorySchema = new Schema(
  {
    category: {
      type: String,
      enum: [
        "Tourist",
        "Business",
        "Student",
        "Work",
        "Investor",
        "Medical",
        "Diplomatic",
        "Other",
      ],
      required: true,
    },
    visaType: {
      type: String,
      enum: [
        "Visa-Free",
        "Visa on Arrival",
        "eVisa",
        "Embassy Required",
        "Restricted",
      ],
      required: true,
    },
    maxStayDays: { type: Number },
    applicationLink: { type: String },
    eligibleFor: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    processingTimeDays: { type: Number },
    fees: { type: Number },
    multipleEntries: { type: Boolean },
    notes: { type: String },
  },
  { _id: true },
);

const visaServiceSchema = new Schema<IVisaService>(
  {
    countryId: { type: Schema.Types.ObjectId, ref: "Country", required: true },

    serviceName: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },

    currency: { type: String },

    visaCategories: { type: [VisaCategorySchema], default: [] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

visaServiceSchema.index({ countryId: 1 });
visaServiceSchema.index({ serviceName: "text", slug: "text" });

export const VisaServiceModel = model<IVisaService>(
  "VisaService",
  visaServiceSchema,
);
