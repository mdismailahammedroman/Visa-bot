// src/modules/country/country.repository.ts

import { ICountry } from "./country.interface";
import { CountryModel } from "./country.model";

const create = (payload: ICountry) => {
  return CountryModel.create(payload);
};

const findByName = (name: string) => {
  return CountryModel.findOne({ name });
};

const findAll = () => {
  return CountryModel.find();
};
export const CountryRepository = { create, findByName, findAll };
