import { Types } from "mongoose";

export enum NotificationType {
  VISA_STATUS = "VISA_STATUS",
  ASSIGNMENT = "ASSIGNMENT",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
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
