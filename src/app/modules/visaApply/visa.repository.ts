import { VisaApplicationModel } from "./visa.model";
import { IVisaApplication } from "./visa.interface";

const create = (payload: IVisaApplication) => VisaApplicationModel.create(payload);

const findById = (id: string) => VisaApplicationModel.findById(id);

const findByUserId = (userId: string) => VisaApplicationModel.find({ userId });

const findAll = () => VisaApplicationModel.find();

const updateById = (id: string, payload: Partial<IVisaApplication>) =>
  VisaApplicationModel.findByIdAndUpdate(id, payload, { new: true });

const deleteById = (id: string) => VisaApplicationModel.findByIdAndDelete(id);

export const VisaApplicationRepository = {
  create,
  findById,
  findByUserId,
  findAll,
  updateById,
  deleteById,
};