import { Types } from "mongoose";

export enum NotificationType {
  NEW_APPLICATION = "NEW_APPLICATION",
  VISA_STATUS_UPDATED = "VISA_STATUS_UPDATED",
  ASSIGNED = "ASSIGNED_APPLICATION",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
  OTHER_NOTIFICATION = "OTHER_NOTIFICATION",
}

export interface INotification {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;

  title: string;
  message: string;

  type: NotificationType;

  isRead: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
