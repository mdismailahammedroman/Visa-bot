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
  INFO = "INFO",
  SLOT_FOUND = "SLOT_FOUND",

  APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED",
  APPOINTMENT_FAILED = "APPOINTMENT_FAILED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",

  // 🔥 Add these for visa application notifications
  APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED",
  APPLICATION_UPDATED = "APPLICATION_UPDATED",
  APPLICATION_ASSIGNMENT = "APPLICATION_ASSIGNMENT",
  APPLICATION_STATUS_UPDATE = "APPLICATION_STATUS_UPDATE",
}
