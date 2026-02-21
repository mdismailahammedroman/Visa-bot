import { Types } from "mongoose";

// ✅ Enums for Visa Category & Visa Type
export enum VisaCategoryEnum {
  TOURIST = "Tourist",
  BUSINESS = "Business",
  STUDENT = "Student",
  WORK = "Work",
  INVESTOR = "Investor",
  MEDICAL = "Medical",
  DIPLOMATIC = "Diplomatic",
  OTHER = "Other",
}

export enum VisaTypeEnum {
  VISA_FREE = "Visa-Free",
  VISA_ON_ARRIVAL = "Visa on Arrival",
  E_VISA = "eVisa",
  EMBASSY_REQUIRED = "Embassy Required",
  RESTRICTED = "Restricted",
}

// ✅ Visa Service Interface (plain structure)
export interface IVisaService {
  countryId: Types.ObjectId;
  serviceName: string;
  slug: string;

  description?: string;
  currency?: string;

  visaCategories: VisaCategoryEnum;
  visaType: VisaTypeEnum;

  maxStayDays?: number;
  eligibleFor?: string[];
  requirements?: string[];
  processingTimeDays?: number;
  fees?: number;
  multipleEntries?: boolean;
  notes?: string;

  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
