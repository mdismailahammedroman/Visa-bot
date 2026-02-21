import { VisaServiceModel } from "./visaService.model";
import { IVisaService } from "./visaService.interface";

const create = (payload: Partial<IVisaService>) =>
  VisaServiceModel.create(payload);

const findById = (id: string) =>
  VisaServiceModel.findById(id);

const findByCountry = (countryId: string) =>
  VisaServiceModel.find({ countryId }).sort({ createdAt: -1 });

const findBySlugAndCountry = (slug: string, countryId: string) =>
  VisaServiceModel.findOne({
    slug: slug.toLowerCase().trim(),
    countryId,
  });

const updateById = (id: string, payload: Partial<IVisaService>) =>
  VisaServiceModel.findByIdAndUpdate(id, payload, { new: true });

const deleteById = (id: string) =>
  VisaServiceModel.findByIdAndDelete(id);


// findByCountryAndCategory wise visa services
const findByCountryAndCategory = (countryId: string, category: string) =>
  VisaServiceModel.find({
    countryId,
    visaCategories: category,
    isActive: true,
  }).lean();

  // /findAllVisaServices
  const findAllVisaServices = async () => {
  return await VisaServiceModel.find({}).sort({ createdAt: -1 }).lean();
};

export const VisaServiceRepository = {
  create,
  findById,
  findByCountry,
  findBySlugAndCountry,
  updateById,
  deleteById,
  findByCountryAndCategory,
  findAllVisaServices,
};