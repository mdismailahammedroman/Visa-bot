import { Types } from "mongoose";
import { GENDER_TYPE } from "../user/user.interface";

/* =========================
   ENUMS (Runtime Safe)
========================= */

export interface IAssignmentHistory {
  assignedBy: Types.ObjectId;
  assignedTo: Types.ObjectId;
  assignedAt: Date;
}

export enum ApplicationStatus {
  PENDING = "Pending",
  PROCESSING = "In Process",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}



export enum IncomeSource {
  SELF_FUNDED = "Self Funded",
  FRIEND_OR_FAMILY = "Friend or Family",
  EMPLOYEE_BUSINESS_TRAVEL = "Employee Business Travel",
}

/* =========================
   INTERFACE
========================= */

export interface IVisaApplication {
  _id?: Types.ObjectId;

  trackingId: string;

  userId: Types.ObjectId;
  fromCountryName?: string;
  visaServiceId: Types.ObjectId;
  countryId: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  assignmentHistory?: IAssignmentHistory[];
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


  status: ApplicationStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
