import { Types } from "mongoose";

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  STRIPE = "STRIPE",
}

export interface IVisaApplicationPayment {
  applicationId: Types.ObjectId;
  userId: Types.ObjectId;

  paymentIntentId: string;

  amount: number;
  currency: string;

  method: PaymentMethod;

  status: PaymentStatus;

  createdAt?: Date;
  updatedAt?: Date;
}