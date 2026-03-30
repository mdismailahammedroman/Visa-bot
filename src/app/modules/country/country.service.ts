import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { ICountry } from "./country.interface";
import { CountryRepository } from "./country.repository";

import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import { getCurrencyRate } from "../../utils/fixer";

const createCountry = async (payload: ICountry) => {
  payload.isoCode = payload.isoCode.toUpperCase().trim();

  const existingByName = await CountryRepository.findByName(
    payload.countryName,
  );
  if (existingByName) {
    throw new AppError(StatusCodes.CONFLICT, "Country name already exists");
  }

  const existingByIso = await CountryRepository.findByIsoCode(payload.isoCode);
  if (existingByIso) {
    throw new AppError(StatusCodes.CONFLICT, "ISO code already exists");
  }

  let currencyRate: number | null = null;

  if (payload.currency) {
    const rate = await getCurrencyRate(payload.currency);
    if (rate) currencyRate = rate;
  }

  const dataToCreate: ICountry = {
    ...payload,
    currencyRate,
  };

  if (payload.notes) {
    dataToCreate.notes = payload.notes;
  } else if (payload.currency) {
    dataToCreate.notes = `Current EUR → ${payload.currency} rate: ${currencyRate ?? "N/A"}`;
  }

  return CountryRepository.create(dataToCreate);
};

const getAllCountries = async (query: QueryParams) => {
  const baseQuery = CountryRepository.findAll();

  const qb = new QueryBuilder(baseQuery, query)
    .search(["countryName", "isoCode", "continent"])
    .filter()
    .sort()
    .paginate()
    .fields();

  return await qb.build();
};

const updateCountry = async (id: string, payload: Partial<ICountry>) => {
  if (payload.isoCode) {
    payload.isoCode = payload.isoCode.toUpperCase().trim();
  }

  if (payload.countryName) {
    const existing = await CountryRepository.findByName(payload.countryName);
    if (existing && existing._id.toString() !== id) {
      throw new AppError(StatusCodes.CONFLICT, "Country name already exists");
    }
  }

  const updated = await CountryRepository.updateById(id, payload);

  if (!updated) {
    throw new AppError(StatusCodes.NOT_FOUND, "Country not found");
  }

  return updated;
};

const getCountryById = async (id: string, liveRate?: boolean) => {
  const country = await CountryRepository.findById(id);

  if (!country) {
    throw new AppError(StatusCodes.NOT_FOUND, "Country not found");
  }

  if (liveRate && country.currency) {
    const rate = await getCurrencyRate(country.currency);
    return { ...country.toObject(), currencyRate: rate };
  }

  return country;
};

const deleteCountry = async (id: string) => {
  const deleted = await CountryRepository.deleteById(id);

  if (!deleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Country not found");
  }

  return deleted;
};

export const CountryService = {
  createCountry,
  getAllCountries,
  updateCountry,
  getCountryById,
  deleteCountry,
};
