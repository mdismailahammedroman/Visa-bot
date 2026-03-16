import { Schema, model } from "mongoose";
import {
  IVisaApplicationPayment,
  PaymentMethod,
  PaymentStatus,
} from "./payment.interface";

const paymentSchema = new Schema<IVisaApplicationPayment>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "VisaApplication",
      required: true,

    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,

    },

    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "usd",
    },

    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.STRIPE,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ applicationId: 1 });

export const VisaApplicationPaymentModel = model(
  "VisaApplicationPayment",
  paymentSchema
);