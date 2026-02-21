import { Schema, model } from "mongoose";
import {
  IVisaService,
  VisaCategoryEnum,
  VisaTypeEnum,
} from "./visaService.interface";

const visaServiceSchema = new Schema<IVisaService>(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true,
    },

    serviceName: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: { type: String },
    currency: { type: String },

    visaCategories: {
      type: String,
      enum: Object.values(VisaCategoryEnum),
      required: true,
    },

    visaType: {
      type: String,
      enum: Object.values(VisaTypeEnum),
      required: true,
    },

    maxStayDays: { type: Number },
    eligibleFor: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    processingTimeDays: { type: Number },
    fees: { type: Number },
    multipleEntries: { type: Boolean },
    notes: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

/**
 * Compound Unique Index
 * Same slug allowed in different countries
 * But NOT allowed inside same country
 */
visaServiceSchema.index({ countryId: 1, slug: 1 }, { unique: true });

visaServiceSchema.set("toJSON", {
  transform: function (_doc, ret) {
    const { _id, ...rest } = ret;

    return {
      id: _id,
      ...rest,
    };
  },
});

/**
 *  Text search index
 */
visaServiceSchema.index({
  serviceName: "text",
  slug: "text",
});

export const VisaServiceModel = model<IVisaService>(
  "VisaService",
  visaServiceSchema,
);
