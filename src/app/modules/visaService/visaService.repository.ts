import { VisaServiceModel } from "./visaService.model";
import { IVisaService } from "./visaService.interface";

const create = (payload: Partial<IVisaService>) =>
  VisaServiceModel.create(payload);

const findBySlug = (slug: string) =>
  VisaServiceModel.findOne({ slug: slug.toLowerCase().trim() });

const findById = (id: string) => VisaServiceModel.findById(id);

const findByCountry = (countryId: string) =>
  VisaServiceModel.find({ countryId }).sort({ createdAt: -1 });

const updateById = (id: string, payload: Partial<IVisaService>) =>
  VisaServiceModel.findByIdAndUpdate(id, payload, { new: true });

export const VisaServiceRepository = {
  create,
  findBySlug,
  findById,
  findByCountry,
  updateById,
};
