// src/modules/country/country.service.ts
import { ICountry } from "./country.interface";
import { CountryRepository } from "./country.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

const createCountry = async (payload: ICountry) => {
  // Check if country already exists
  const existing = await CountryRepository.findByName(payload.name);
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, "Country already exists");
  }

  const country = await CountryRepository.create(payload);
  return country;
};

const getAllCountries = async () => {
  const countries = await CountryRepository.findAll();
  return countries;
};

export const CountryService = {
  createCountry,
  getAllCountries,
};
