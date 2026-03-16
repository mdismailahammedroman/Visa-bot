import { Schema, model } from "mongoose";
import { INewsletterSubscriber } from "./newsletter.interface";

const subscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["SUBSCRIBED", "UNSUBSCRIBED"],
      default: "SUBSCRIBED",
    },
  },
  { timestamps: true }
);

export const SubscriberModel = model<INewsletterSubscriber>(
  "NewsletterSubscriber",
  subscriberSchema
);