/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisaServiceRepository } from "./visaService.repository";
import { CountryRepository } from "../country/country.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";

// helper
const normalizeSlug = (slug: string) => slug.toLowerCase().trim();

const createVisaServiceForCountry = async (countryId: string, payload: any) => {
  const country = await CountryRepository.findById(countryId);
  if (!country) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");

  payload.slug = normalizeSlug(payload.slug);

  const existing = await VisaServiceRepository.findBySlug(payload.slug);
  if (existing)
    throw new AppError(StatusCodes.CONFLICT, "VisaService slug already exists");

  if (!payload.visaCategories || payload.visaCategories.length < 1)
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "At least 1 visa category is required",
    );

  return VisaServiceRepository.create({ ...payload, countryId });
};

const getVisaServicesByCountry = async (
  countryId: string,
  queryParams: QueryParams = {}
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

const updateVisaService = async (id: string, payload: any) => {
  if (payload.slug) payload.slug = normalizeSlug(payload.slug);

  if (payload.slug) {
    const existing = await VisaServiceRepository.findBySlug(payload.slug);
    if (existing && String(existing._id) !== String(id))
      throw new AppError(
        StatusCodes.CONFLICT,
        "VisaService slug already exists",
      );
  }

  const updated = await VisaServiceRepository.updateById(id, payload);
  if (!updated)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");
  return updated;
};

const deleteVisaService = async (id: string) => {
  const deleted = await VisaServiceRepository.deleteById(id);
  if (!deleted)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");
  return deleted;
};

export const VisaServiceService = {
  createVisaServiceForCountry,
  getVisaServicesByCountry,
  getVisaServiceById,
  updateVisaService,
  deleteVisaService,
};
