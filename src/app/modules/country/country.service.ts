/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/country/country.service.ts
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { ICountry } from "./country.interface";
import { CountryRepository } from "./country.repository";

const createCountry = async (payload: ICountry) => {
  payload.isoCode = payload.isoCode.toUpperCase().trim();

  const existingName = await CountryRepository.findByName(payload.name);
  if (existingName)
    throw new AppError(StatusCodes.CONFLICT, "Country name already exists");

  const existingCode = await CountryRepository.findByIsoCode(payload.isoCode);
  if (existingCode)
    throw new AppError(StatusCodes.CONFLICT, "Country ISO code already exists");

  return CountryRepository.create(payload);
};

const getAllCountries = async (query: any) => {
  // simple search support
  const q: any = {};
  if (query.search) q.$text = { $search: query.search };
  if (query.continent) q.continent = query.continent;

  return CountryRepository.findAll(q);
};

const updateCountry = async (id: string, payload: Partial<ICountry>) => {
  if (payload.isoCode) payload.isoCode = payload.isoCode.toUpperCase().trim();

  const updated = await CountryRepository.updateById(id, payload);
  if (!updated) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");

  return updated;
};

const getCountryById = async (id: string) => {
  const c = await CountryRepository.findById(id);
  if (!c) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");
  return c;
};

export const CountryService = {
  createCountry,
  getAllCountries,
  updateCountry,
  getCountryById,
};
