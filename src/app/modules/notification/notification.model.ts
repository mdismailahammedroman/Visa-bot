import { Schema, model, Types } from "mongoose";

export enum NotificationType {
  SLOT_FOUND = "SLOT_FOUND",
  APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED",
  APPOINTMENT_FAILED = "APPOINTMENT_FAILED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model("Notification", NotificationSchema);