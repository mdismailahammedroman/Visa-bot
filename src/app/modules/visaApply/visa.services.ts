
import { IVisaApplication } from "./visa.interface";
import { VisaApplicationRepository } from "./visa.repository";

const createVisaApplication = async (payload: IVisaApplication) => {
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

export const VisaApplicationService = {
  createVisaApplication,
  getAllVisaApplications,
  getVisaApplicationById,
  updateVisaApplication,
  deleteVisaApplication,
};