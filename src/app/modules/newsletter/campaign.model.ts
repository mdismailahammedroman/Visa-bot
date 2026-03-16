import { Schema, model, Types } from "mongoose";
import { INewsletterCampaign } from "./newsletter.interface";

const campaignSchema = new Schema<INewsletterCampaign>(
  {
    title: String,
    subject: String,
    content: String,

    status: {
      type: String,
      enum: ["DRAFT", "SENT"],
      default: "DRAFT",
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    sentAt: Date,
    totalRecipients: Number,
  },
  { timestamps: true }
);

export const CampaignModel = model<INewsletterCampaign>(
  "NewsletterCampaign",
  campaignSchema
);