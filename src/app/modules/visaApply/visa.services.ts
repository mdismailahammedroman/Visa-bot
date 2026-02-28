
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { ApplicationStatus, IVisaApplication, PaymentStatus } from "./visa.interface";
import { VisaApplicationRepository } from "./visa.repository";

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

const updateVisaApplication = async (id: string, payload: Partial<IVisaApplication>) => {
  return await VisaApplicationRepository.updateById(id, payload);
};

const deleteVisaApplication = async (id: string) => {
  return await VisaApplicationRepository.deleteById(id);
};


const payVisaApplication = async (id: string, userId: string) => {
  const application = await VisaApplicationRepository.findById(id);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  // Ensure user owns the application
  if (application.userId.toString() !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized payment attempt");
  }

  if (application.paymentStatus === PaymentStatus.PAID) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Application already paid");
  }

  if (!application.totalFee || application.totalFee <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid payment amount");
  }

  // 🔹 Here you integrate Stripe / SSLCommerz / etc
  // For now we simulate success

  const updated = await VisaApplicationRepository.updateById(id, {
    paymentStatus: PaymentStatus.PAID,
    status: ApplicationStatus.PROCESSING, // move to processing after payment
  });

  return updated;
};

export const VisaApplicationService = {
  createVisaApplication,
  getAllVisaApplications,
  getVisaApplicationById,
  updateVisaApplication,
  deleteVisaApplication,
  payVisaApplication,
};