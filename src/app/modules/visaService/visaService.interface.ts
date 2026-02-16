import { Types } from "mongoose"; // assuming MongoDB ObjectId

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

// ✅ Visa Service Interface
export interface IVisaService {
  countryId: Types.ObjectId; // which country these rules apply to
  serviceName: string; // e.g., "USA Visa Information & Apply"
  slug: string; // unique identifier
  description?: string;

  currency?: string; // default currency
  // ✅ Multiple visa categories per service
  visaCategories: {
    category: VisaCategoryEnum;
    visaType: VisaTypeEnum;
    maxStayDays?: number;
    applicationLink?: string;
    eligibleFor?: string[];
    requirements?: string[];
    processingTimeDays?: number;
    fees?: number;
    multipleEntries?: boolean;
    notes?: string;
  }[];
  isActive?: boolean; // service status

  createdAt?: string;
  updatedAt?: string;
}
