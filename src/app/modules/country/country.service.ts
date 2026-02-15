// src/modules/country/country.service.ts

import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { ICountry } from "./country.interface";
import { CountryRepository } from "./country.repository";

const createCountry = async (payload: ICountry) => {
  const exists = await CountryRepository.findByName(payload.name);

  if (exists) {
    throw new AppError(StatusCodes.CONFLICT, "Country already exists");
  }

  return CountryRepository.create(payload);
};

const getAllCountries = async () => {
  return CountryRepository.findAll();
};

export const CountryService = {
  createCountry,
  getAllCountries,
};
