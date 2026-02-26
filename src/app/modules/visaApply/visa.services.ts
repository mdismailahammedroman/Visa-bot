/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { VisaApplicationRepository } from "./visa.repository";
import { VisaServiceRepository } from "../visaService/visaService.repository";
import {
  ApplicationStatus,
  PaymentStatus,
  IVisaApplication,
} from "./visa.interface";
import { Types } from "mongoose";
import { IUser, Role } from "../user/user.interface";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import { VisaApplicationModel } from "./visa.model";

// simple tracking generator
const generateTrackingId = () => {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `VISA-${Date.now()}-${rand}`;
};

// ✅ Apply (Create Draft)
const applyVisaService = async (userId: string, visaServiceId: string) => {
  const visaService = await VisaServiceRepository.findById(visaServiceId).lean();
  if (!visaService) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa service not found");
  }

  // fees snapshot from service
  const visaFee = Number(visaService.fees || 0);
  const serviceFee = 0; 
  const totalFee = visaFee + serviceFee;

  const payload: Partial<IVisaApplication> = {
    trackingId: generateTrackingId(),
    userId: new Types.ObjectId(userId),
    visaServiceId: new Types.ObjectId(visaServiceId),
    countryId: new Types.ObjectId(visaService.countryId),

    isDraft: true,

    visaFee,
    serviceFee,
    totalFee,

    paymentStatus: PaymentStatus.UNPAID,
    status: ApplicationStatus.DRAFT,
  };

  return VisaApplicationRepository.create(payload);
};

// ✅ Update Draft (step data save)
const updateApplicationDraft = async (
  userId: string,
  applicationId: string,
  payload: Partial<IVisaApplication>,
) => {
  const app = await VisaApplicationRepository.findByIdAndUser(
    applicationId,
    userId,
  );

  if (!app) throw new AppError(StatusCodes.NOT_FOUND, "Application not found");

  if (!app.isDraft) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot update. Application already submitted",
    );
  }

  // prevent changing core fields
  delete (payload as any).userId;
  delete (payload as any).visaServiceId;
  delete (payload as any).countryId;
  delete (payload as any).trackingId;
  delete (payload as any).paymentStatus;
  delete (payload as any).status;
  delete (payload as any).totalFee;
  delete (payload as any).visaFee;
  delete (payload as any).serviceFee;

  const updated = await VisaApplicationRepository.updateById(applicationId, payload);
  return updated;
};
          
// ✅ Submit
const submitApplication = async (userId: string, applicationId: string) => {
  const app = await VisaApplicationRepository.findByIdAndUser(
    applicationId,
    userId,
  );
  if (!app) throw new AppError(StatusCodes.NOT_FOUND, "Application not found");

  if (!app.isDraft) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Already submitted");
  }

  // minimum required checks (customize as needed)
  const required = [
    app.fullName,
    app.email,
    app.phoneNumber,
    app.birthDate,
    app.passportNumber,
    app.gender,
    app.visaFee,
    app.incomeSource,
    app.monthlyIncome,
    app.bankName,
    app.accountNumber,
    app.bankStatement,
    app.passportCopy,
    app.passportPhoto,
    app.oldVisaCopy,
  ];

  if (required.some((x) => !x)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please complete required personal information before submit",
    );
  }

  const updated = await VisaApplicationRepository.updateById(applicationId, {
    isDraft: false,
    status: ApplicationStatus.PENDING,
  });

  return updated;
};

// ✅ Pay (manual endpoint; normally payment gateway callback করবে)
const markAsPaid = async (userId: string, applicationId: string) => {
  const app = await VisaApplicationRepository.findByIdAndUser(
    applicationId,
    userId,
  );
  if (!app) throw new AppError(StatusCodes.NOT_FOUND, "Application not found");

  const updated = await VisaApplicationRepository.updateById(applicationId, {
    paymentStatus: PaymentStatus.PAID,
  });

  return updated;
};

// ✅ My Applications
const getMyApplications = async (userId: string) => {
  return VisaApplicationRepository.findMyApplications(userId);
};

// ✅ MANAGER: Get all applications (FIXED)
const getAllApplicationsForManager = async (queryParams: QueryParams = {}) => {
  const baseQuery = VisaApplicationModel.find({})
    .populate("userId", "name email")
    .populate("countryId", "countryName isoCode")
    .populate("visaServiceId", "serviceName slug")
    .sort({ createdAt: -1 });

  const qb = new QueryBuilder(baseQuery, queryParams)
    .search(["trackingId"])
    .filter()
    .sort()
    .paginate()
    .fields();

  return qb.build();
};

// ✅ MANAGER: Get one application (FIXED)
const getApplicationByIdForManager = async (id: string) => {
  const app = await VisaApplicationModel.findById(id)
    .populate("userId", "name email")
    .populate("countryId", "countryName isoCode")
    .populate("visaServiceId", "serviceName slug")
    .lean();

  if (!app) throw new AppError(StatusCodes.NOT_FOUND, "Application not found");
  return app;
};

// ✅ MANAGER: Update status
const updateApplicationStatus = async (
  managerUser: IUser,
  applicationId: string,
  status: ApplicationStatus,
) => {
  if (![Role.MANAGER, Role.MAIN_MANAGER].includes(managerUser.role)) {
    throw new AppError(StatusCodes.FORBIDDEN, "Only manager can update status");
  }

  if (!Object.values(ApplicationStatus).includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status");
  }

  const allowed = [
    ApplicationStatus.PROCESSING,
    ApplicationStatus.APPROVED,
    ApplicationStatus.REJECTED,
  ];
  if (!allowed.includes(status)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Status can only be Processing, Approved or Rejected",
    );
  }

  const existing = await VisaApplicationRepository.findById(applicationId);
  if (!existing) throw new AppError(StatusCodes.NOT_FOUND, "Application not found");

  if (existing.isDraft) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Cannot update status for draft application");
  }

  return VisaApplicationRepository.updateById(applicationId, { status });
}


export const VisaApplicationService = {
  // existing user services:
  applyVisaService,
  updateApplicationDraft,
  submitApplication,
  markAsPaid,
  getMyApplications,

  // manager services:
  getAllApplicationsForManager,
  getApplicationByIdForManager,
  updateApplicationStatus,
};