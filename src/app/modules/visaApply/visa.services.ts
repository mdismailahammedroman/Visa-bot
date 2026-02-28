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

const createVisaApplication = async (payload: IVisaApplication) => {
  const visaService = await VisaServiceRepository.findById(
    payload.visaServiceId.toString(),
  );
  if (!visaService) throw new Error("Visa Service not found");

  const visaFee = visaService.visaFee || 0;
  const serviceFee = visaService.serviceFee || 0;

  payload.visaFee = visaFee;
  payload.serviceFee = serviceFee;
  payload.totalFee = visaFee + serviceFee;

  return await VisaApplicationRepository.create(payload);
};

const getAllVisaApplications = async () => {
  return await VisaApplicationRepository.findAll();
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

const getAllForManager = async (queryParams: any) => {
  const query = new QueryBuilder(
    VisaApplicationRepository.findAll()
      .populate("user")
      .populate("visaService"),
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
  const allowedStatuses = ["PENDING", "PROCESSING", "APPROVED", "REJECTED"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status value");
  }

  const updated = await VisaApplicationRepository.updateById(id, { status });

  if (!updated) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  return updated;
};

const deleteVisaApplication =async (id:string)=>{
  const deleted =await VisaServiceRepository.deleteById(id);
  if (deleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "visa application not found");
  }
  return deleted;
}

export const VisaApplicationService = {
  createVisaApplication,
  getAllVisaApplications,
  payVisaApplication,
  getAllForManager,
  getOneForManager,
  updateStatus,
  deleteVisaApplication,
};
