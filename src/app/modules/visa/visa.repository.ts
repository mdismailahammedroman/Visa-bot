// src/modules/visa/visa.repository.ts
import { Types } from "mongoose";
import { VisaApplicationModel } from "./visa.model";
import { IVisaApplication, StepKey } from "./visa.interface";

const createDraft = (userId: Types.ObjectId) => {
  return VisaApplicationModel.create({ userId });
};

const findById = (appId: string) => {
  return VisaApplicationModel.findById(appId);
};

const findByIdAndUser = (appId: string, userId: Types.ObjectId) => {
  return VisaApplicationModel.findOne({ _id: appId, userId });
};

const updateById = (appId: string, update: Partial<IVisaApplication>) => {
  return VisaApplicationModel.findByIdAndUpdate(appId, update, { new: true });
};

const pushCompletedStep = (appId: string, step: StepKey, nextStep: StepKey) => {
  return VisaApplicationModel.findByIdAndUpdate(
    appId,
    {
      $addToSet: { completedSteps: step },
      $set: { currentStep: nextStep },
    },
    { new: true },
  );
};

export const VisaApplicationRepository = {
  createDraft,
  findById,
  findByIdAndUser,
  updateById,
  pushCompletedStep,
};
