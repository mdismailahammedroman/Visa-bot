/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisaApplicationModel } from "./visa.model";
import { IVisaApplication } from "./visa.interface";

const create = (payload: Partial<IVisaApplication>) =>
  VisaApplicationModel.create(payload);

const findById = (id: string) => VisaApplicationModel.findById(id);

const findByIdAndUser = (id: string, userId: string) =>
  VisaApplicationModel.findOne({ _id: id, userId });

const findMyApplications = (userId: string) =>
  VisaApplicationModel.find({ userId }).sort({ createdAt: -1 });

const findAll = (filter: any = {}) =>
  VisaApplicationModel.find(filter).sort({ createdAt: -1 });

const updateById = (id: string, payload: Partial<IVisaApplication>) =>
  VisaApplicationModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );

const deleteById = (id: string) => VisaApplicationModel.findByIdAndDelete(id);

export const VisaApplicationRepository = {
  create,
  findById,
  findByIdAndUser,
  findMyApplications,
  findAll,
  updateById,
  deleteById,
};
