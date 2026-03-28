/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId | string;
  title: string;
  message: string;
  type?: NotificationType;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum NotificationType {
  INFO = "INFO", // ✅ add this
  SLOT_FOUND = "SLOT_FOUND",
  APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED",
  APPOINTMENT_FAILED = "APPOINTMENT_FAILED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",
}
