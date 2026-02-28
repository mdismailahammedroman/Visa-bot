import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { IVisaApplication, PaymentStatus } from "./visa.interface";
import { VisaApplicationRepository } from "./visa.repository";
import { stripe } from "../../config/stripe";

const createVisaApplication = async (payload: IVisaApplication) => {
  payload.totalFee = (payload.visaFee || 0) + (payload.serviceFee || 0);
  return await VisaApplicationRepository.create(payload);
};

const getAllVisaApplications = async () => {
  return await VisaApplicationRepository.findAll();
};

const getVisaApplicationById = async (id: string) => {
  return await VisaApplicationRepository.findById(id);
};

const updateVisaApplication = async (
  id: string,
  payload: Partial<IVisaApplication>,
) => {
  return await VisaApplicationRepository.updateById(id, payload);
};

const deleteVisaApplication = async (id: string) => {
  return await VisaApplicationRepository.deleteById(id);
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




export const VisaApplicationService = {
  createVisaApplication,
  getAllVisaApplications,
  getVisaApplicationById,
  updateVisaApplication,
  deleteVisaApplication,
  payVisaApplication,
};
