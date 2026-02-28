// visaService.interface.ts
import { Types } from "mongoose";

// ✅ Visa Category & Visa Type enums
export enum VisaCategoryEnum {
  TOURIST = "TOURIST",
  BUSINESS = "BUSINESS",
  STUDENT = "STUDENT",
  WORK = "WORK",
  INVESTOR = "INVESTOR",
  MEDICAL = "MEDICAL",
  DIPLOMATIC = "DIPLOMATIC",
  OTHER = "OTHER",
}

export enum VisaTypeEnum {
  VISA_FREE = "VISA_FREE",
  VISA_ON_ARRIVAL = "VISA_ON_ARRIVAL",
  E_VISA = "E_VISA",
  EMBASSY_REQUIRED = "EMBASSY_REQUIRED",
  RESTRICTED = "RESTRICTED",
}

// ✅ Visa Service Interface
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

  visaFee?: number;
  serviceFee?: number;
  totalFee?: number;

  multipleEntries?: boolean;
  notes?: string;

  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}