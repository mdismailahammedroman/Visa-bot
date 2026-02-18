import { CountryModel } from "./country.model";
import { ICountry } from "./country.interface";

const create = (payload: ICountry) => CountryModel.create(payload);

const findByName = (countryName: string) =>
  CountryModel.findOne({ countryName });

const findByIsoCode = (isoCode: string) =>
  CountryModel.findOne({ isoCode: isoCode.toUpperCase() });

const findAll = () => CountryModel.find();

const findById = (id: string) => CountryModel.findById(id);

const updateById = (id: string, payload: Partial<ICountry>) =>
  CountryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

export const CountryRepository = {
  create,
  findByName,
  findByIsoCode,
  findAll,
  findById,
  updateById,
};
