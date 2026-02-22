// src/modules/visa/visa.service.ts
import { IVisaApplication, StepKey } from "./visa.interface";
import { VisaRepository } from "./visa.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

const startApplication = async (userId: string) => {
  return VisaRepository.createVisaApplication(new Types.ObjectId(userId));
};

const updateStep = async (
  visaId: string,
  stepKey: StepKey,
  data: Partial<IVisaApplication>,
) => {
  const visa = await VisaRepository.findById(visaId);
  if (!visa)
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");

  // Update currentStep and completedSteps
  if (!visa.completedSteps.includes(stepKey)) {
    visa.completedSteps.push(stepKey);
  }
  visa.currentStep = stepKey;

  // Merge data
  Object.assign(visa, data);

  return visa.save();
};

const getVisaApplication = async (visaId: string) => {
  const visa = await VisaRepository.findById(visaId);
  if (!visa)
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  return visa;
};

export const VisaService = {
  startApplication,
  updateStep,
  getVisaApplication,
};
