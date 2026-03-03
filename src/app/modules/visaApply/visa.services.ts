/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import {
  ApplicationStatus,
  IVisaApplication,
  PaymentStatus,
} from "./visa.interface";
import { VisaApplicationRepository } from "./visa.repository";
import { stripe } from "../../config/stripe";
import { VisaServiceRepository } from "../visaService/visaService.repository";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Types } from "mongoose";
import { userRepository } from "../user/user.repository";
import { Role } from "../user/user.interface";

const createVisaApplication = async (payload: IVisaApplication) => {
  const applyVisaServices = await VisaServiceRepository.findById(
    payload.visaServiceId.toString(),
  );
  if (!applyVisaServices) throw new Error("Visa Service not found");

  // 🔎 Check previous application for same user + service
  const activeApplication =
    await VisaApplicationRepository.findActiveApplication(
      payload.userId.toString(),
      payload.visaServiceId.toString(),
    );

  if (activeApplication) {
    throw new Error(
      "You already have a pending or processing visa application.",
    );
  }

  const visaFee = applyVisaServices.visaFee || 0;
  const serviceFee = applyVisaServices.serviceFee || 0;

  payload.visaFee = visaFee;
  payload.serviceFee = serviceFee;
  payload.totalFee = visaFee + serviceFee;

  return await VisaApplicationRepository.create(payload);
};

const updateApplication = async (
  id: string,
  payload: Partial<IVisaApplication>,
) => {
  const updated = await VisaApplicationRepository.updateById(id, payload);
  if (!updated) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }
  return updated;
};

const payVisaApplication = async (id: string, userId: string) => {
  const application = await VisaApplicationRepository.findById(id);

  if (!application)
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  if (application.userId.toString() !== userId)
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized");
  if (application.paymentStatus === PaymentStatus.PAID)
    throw new AppError(StatusCodes.BAD_REQUEST, "Already paid");
  if (!application.totalFee || application.totalFee <= 0)
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid amount");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(application.totalFee * 100), // cents
    currency: "usd",
    metadata: { applicationId: id, userId },
  });

  return { clientSecret: paymentIntent.client_secret };
};

const getAllApplication = async (queryParams: any) => {
  const query = new QueryBuilder(
    VisaApplicationRepository.findAll()
      .populate("userId")
      .populate("visaServiceId")
      .populate("countryId"),
    queryParams,
  )
    .search(["status"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await query.build();

  return result;
};

const getOneForManager = async (id: string) => {
  const result = await VisaApplicationRepository.findById(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  return result;
};

const updateStatus = async (id: string, status: ApplicationStatus) => {
  // optional runtime validation
  if (!Object.values(ApplicationStatus).includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status value");
  }

  const updated = await VisaApplicationRepository.updateById(id, { status });

  if (!updated) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  return updated;
};

const deleteVisaApplication = async (id: string) => {
  const deleted = await VisaApplicationRepository.deleteById(id);
  if (!deleted)
    throw new AppError(StatusCodes.NOT_FOUND, "visa application not found");
  return deleted;
};

const assignApplication = async (
  applicationId: string,
  managerId: string,
  assignedById: string,
) => {
  // ✅ Validate ObjectId
  if (
    !Types.ObjectId.isValid(applicationId) ||
    !Types.ObjectId.isValid(managerId)
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const application = await VisaApplicationRepository.findById(applicationId);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Application not found");
  }

  // ❌ Already assigned to someone
  if (application.assignedTo) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Application already assigned to a manager",
    );
  }

  // ❌ Cannot assign completed application
  if (
    application.status === ApplicationStatus.APPROVED ||
    application.status === ApplicationStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot assign completed application",
    );
  }

  // ✅ Check manager exists & role
  const manager = await userRepository.findById(managerId);

  if (!manager || manager.role !== Role.MANAGER) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid manager");
  }

  // ✅ Assign only once
  application.assignedTo = new Types.ObjectId(managerId);
  application.status = ApplicationStatus.PROCESSING;

  application.assignmentHistory = [
    {
      assignedBy: new Types.ObjectId(assignedById),
      assignedTo: new Types.ObjectId(managerId),
      assignedAt: new Date(),
    },
  ];

  await application.save();

  return await VisaApplicationRepository.findByIdWithPopulate(applicationId);
};

const getOneApplicationForAdmin = async (applicationId: string) => {
  // ✅ Validate ObjectId
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Application ID");
  }

  // ✅ Find the application with populated references
  const application =
    await VisaApplicationRepository.findByIdWithPopulate(applicationId);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  return application;
};

const getMyAssignedApplications = async (
  managerId: string,
  queryParams: any,
) => {
  const query = new QueryBuilder(
    VisaApplicationRepository.findAll()
      .find({ assignedTo: managerId })
      .populate("userId")
      .populate("visaServiceId")
      .populate("countryId"),
    queryParams,
  )
    .search(["status"])
    .filter()
    .sort()
    .paginate()
    .fields();

  return await query.build();
};

const updateByManager = async (
  applicationId: string,
  managerId: string,
  payload: Partial<IVisaApplication>,
) => {
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Application ID");
  }

  const application = await VisaApplicationRepository.findById(applicationId);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Application not found");
  }

  // ❌ Not assigned
  if (!application.assignedTo) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Application not assigned yet");
  }

  // ❌ Not his application
  if (application.assignedTo.toString() !== managerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to edit this application",
    );
  }

  // ❌ Completed হলে edit না
  if (
    application.status === ApplicationStatus.APPROVED ||
    application.status === ApplicationStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot edit completed application",
    );
  }

  const updated = await VisaApplicationRepository.updateById(
    applicationId,
    payload,
  );

  return updated;
};
export const VisaApplicationService = {
  createVisaApplication,
  updateApplication,
  payVisaApplication,
  getAllApplication,
  getOneForManager,
  updateStatus,
  deleteVisaApplication,
  assignApplication,
  getMyAssignedApplications,
  updateByManager,
  getOneApplicationForAdmin,
};
