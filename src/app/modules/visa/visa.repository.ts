// src/modules/visa/visa.repository.ts
import { IVisaApplication } from "./visa.interface";
import { VisaApplicationModel } from "./visa.model";
import { Types } from "mongoose";

const createVisaApplication = (userId: Types.ObjectId) => {
  return VisaApplicationModel.create({ userId });
};

const findById = (id: string) => {
  return VisaApplicationModel.findById(id);
};

const updateVisaApplication = (
  id: string,
  update: Partial<IVisaApplication>,
) => {
  return VisaApplicationModel.findByIdAndUpdate(id, update, { new: true });
};

const findByUserId = (userId: string) => {
  return VisaApplicationModel.find({ userId }).sort({ createdAt: -1 });
};

export const VisaRepository = {
  createVisaApplication,
  findById,
  updateVisaApplication,
  findByUserId,
};
