// src/modules/visa/visa.interface.ts
import { Types } from "mongoose";
import { GENDER_TYPE } from "../user/user.interface";

export type Currency = "BDT" | "USD";
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED";

export type StepKey =
  | "COUNTRY_DESTINATION"
  | "SERVICE_VISA"
  | "FEE"
  | "PERSONAL"
  | "FINANCIAL"
  | "TRAVEL"
  | "REVIEW_SUBMIT";

export type OccupationType =
  | "BUSINESS"
  | "FREELANCE"
  | "EMPLOYED"
  | "STUDENT"
  | "OTHER";
export type TravelMode =
  | "SELF"
  | "FRIEND_FAMILY"
  | "EMPLOYEE"
  | "BUSINESS_TRAVEL";

export interface IFeeSnapshot {
  amount: number;
  currency: Currency;
  breakdown?: Record<string, number>;
}

export interface IFileMeta {
  field: string; // e.g. "bankStatementPdf"
  url: string; // s3 url or local url
  mimeType: string; // "application/pdf"
  size: number; // bytes
  uploadedAt: Date;
}

export interface IPersonalInfo {
  fullName: string;
  gender: GENDER_TYPE;
  dateOfBirth?: string; // ISO date
  passportNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface IFinancialInfo {
  occupationType: OccupationType;
  bankName: string;
  accountNumber: string; // store raw (optionally encrypt), but never return raw in API
  bankStatementFileUrl: string; // pdf url
}

export interface ITravelInfo {
  travelMode: TravelMode;
  note?: string;
}

export interface IVisaApplication {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  countryId?: string;
  destinationId?: string;

  serviceTypeId?: string;
  visaTypeId?: string;

  fee?: IFeeSnapshot;

  personalInfo?: IPersonalInfo;
  financialInfo?: IFinancialInfo;
  travelInfo?: ITravelInfo;

  files: IFileMeta[];

  currentStep: StepKey;
  completedSteps: StepKey[];

  status: ApplicationStatus;

  createdAt: Date;
  updatedAt: Date;
}
