/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisaServiceRepository } from "./visaService.repository";
import { CountryRepository } from "../country/country.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";

/// Helper function to normalize and validate slugs
const normalizeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const createVisaServiceForCountry = async (
  countryId: string,
  payload: any,
) => {
  const country = await CountryRepository.findById(countryId);
  if (!country) {
    throw new AppError(StatusCodes.NOT_FOUND, "Country not found");
  }

  // Auto generate slug
  if (!payload.slug) {
    if (!payload.serviceName) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "serviceName is required to generate slug",
      );
    }

    payload.slug = `${normalizeSlug(country.countryName)}-${normalizeSlug(
  payload.serviceName
)}`
  } else {
    payload.slug = normalizeSlug(payload.slug);
  }

  // ✅ Check duplicate inside SAME country
  const existing =
    await VisaServiceRepository.findBySlugAndCountry(
      payload.slug,
      countryId,
    );

  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This slug already exists in this country",
    );
  }

  return await VisaServiceRepository.create({
    ...payload,
    countryId,
  });
};

const updateVisaService = async (id: string, payload: any) => {
  const existing = await VisaServiceRepository.findById(id);
  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa Service not found");
  }

  if (payload.slug) {
    payload.slug = normalizeSlug(payload.slug);

    const duplicate =
      await VisaServiceRepository.findBySlugAndCountry(
        payload.slug,
        existing.countryId.toString(),
      );

    if (duplicate && duplicate.id !== id) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "Slug already exists in this country",
      );
    }
  }

  return await VisaServiceRepository.updateById(id, payload);
}

const getVisaServicesByCountry = async (
  countryId: string,
  queryParams: QueryParams = {},
) => {
  const country = await CountryRepository.findById(countryId);
  if (!country) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");

  // base query
  const baseQuery = VisaServiceRepository.findByCountry(countryId);

  // QueryBuilder
  const qb = new QueryBuilder(baseQuery, queryParams)
    .search(["serviceName", "slug"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await qb.build(); // returns { data, meta }
  return result;
};

const getVisaServiceById = async (id: string) => {
  const service = await VisaServiceRepository.findById(id).lean();
  if (!service)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");
  return service;
};

const deleteVisaService = async (id: string) => {
  const deleted = await VisaServiceRepository.deleteById(id);
  if (!deleted)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");
  return deleted;
};


const getByCategory = async (countryId: string, category: string) => {
  return await VisaServiceRepository.findByCountryAndCategory(
    countryId,
    category,
  );
};

export const VisaServiceService = {
  createVisaServiceForCountry,
  getVisaServicesByCountry,
  getVisaServiceById,
  updateVisaService,
  deleteVisaService,
  getByCategory,
};
