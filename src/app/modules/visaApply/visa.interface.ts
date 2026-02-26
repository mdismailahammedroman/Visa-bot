import { Types } from "mongoose";
import { GENDER_TYPE } from "../user/user.interface";

/* =========================
   ENUMS (Runtime Safe)
========================= */

export enum ApplicationStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  PROCESSING = "Processing",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum PaymentStatus {
  UNPAID = "Unpaid",
  PAID = "Paid",
  REFUNDED = "Refunded",
}

export enum IncomeSource {
  SELF_FUNDED = "Self funded trip",
  FRIEND_OR_FAMILY = "Friend or family",
  EMPLOYEE_BUSINESS_TRAVEL = "Employee business travel",
}

/* =========================
   INTERFACE
========================= */

export interface IVisaApplication {
  _id?: Types.ObjectId;

  trackingId: string;

  userId: Types.ObjectId;
  visaServiceId: Types.ObjectId;
  countryId: Types.ObjectId;

  isDraft: boolean;

  // Personal
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  passportNumber?: string;
  gender?: GENDER_TYPE;
  visaType?: string;

  // Financial
  incomeSource?: IncomeSource;
  monthlyIncome?: number;
  bankName?: string;
  accountNumber?: string;
  bankStatement?: string;

  // Documents (S3 URL)
  passportCopy?: string;
  passportPhoto?: string;
  oldVisaCopy?: string;

  // Fees
  visaFee?: number;
  serviceFee?: number;
  totalFee?: number;

  paymentStatus: PaymentStatus;
  status: ApplicationStatus;

  createdAt?: Date;
  updatedAt?: Date;
}