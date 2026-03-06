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
  WARNING = "WARNING",
  ALERT = "ALERT",
  NEW_APPLICATION = "NEW_APPLICATION",
  VISA_STATUS_UPDATED = "VISA_STATUS_UPDATED",
  ASSIGNED = "ASSIGNED_APPLICATION",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
  OTHER_NOTIFICATION = "OTHER_NOTIFICATION",
}