/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/country/country.service.ts
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { ICountry } from "./country.interface";
import { CountryRepository } from "./country.repository";
import { getCurrencyRate } from "../../utils/fixer";

const createCountry = async (payload: ICountry) => {
  let currencyRate: number | null = null;
  if (payload.currency) {
    const rate = await getCurrencyRate(payload.currency);
    if (rate) currencyRate = rate;
  }

  return await CountryRepository.create({
    ...payload,
    currencyRate,
    notes: `Current EUR → ${payload.currency} rate: ${currencyRate ?? "N/A"}`,
  });
};

const getAllCountries = async (query: any) => {
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

  if (c.currency) {
    const rate = await getCurrencyRate(c.currency);
    return { ...c.toObject(), currencyRate: rate };
  }
  return c;
};

export const CountryService = {
  createCountry,
  getAllCountries,
  updateCountry,
  getCountryById,
};
