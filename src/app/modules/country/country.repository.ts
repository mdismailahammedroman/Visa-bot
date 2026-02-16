/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/country/country.repository.ts
import { CountryModel } from "./country.model";
import { ICountry } from "./country.interface";

const create = (payload: ICountry) => CountryModel.create(payload);

const findByName = (name: string) => CountryModel.findOne({ name });
const findByIsoCode = (isoCode: string) =>
  CountryModel.findOne({ isoCode: isoCode.toUpperCase() });

const findAll = (query: any = {}) =>
  CountryModel.find(query).sort({ createdAt: -1 });

const findById = (id: string) => CountryModel.findById(id);

const updateById = (id: string, payload: Partial<ICountry>) =>
  CountryModel.findByIdAndUpdate(id, payload, { new: true });

export const CountryRepository = {
  create,
  findByName,
  findByIsoCode,
  findAll,
  findById,
  updateById,
};
