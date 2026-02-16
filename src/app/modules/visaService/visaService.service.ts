/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { VisaServiceRepository } from "./visaService.repository";
import { CountryRepository } from "../country/country.repository";

// helper
const normalizeSlug = (slug: string) => slug.toLowerCase().trim();

const createVisaServiceForCountry = async (countryId: string, payload: any) => {
  // ✅ country exists check
  const country = await CountryRepository.findById(countryId);
  if (!country) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");

  payload.slug = normalizeSlug(payload.slug);

  // ✅ slug unique check
  const existing = await VisaServiceRepository.findBySlug(payload.slug);
  if (existing)
    throw new AppError(StatusCodes.CONFLICT, "VisaService slug already exists");

  // ✅ ensure categories
  if (!payload.visaCategories || payload.visaCategories.length < 1) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "At least 1 visa category is required",
    );
  }

  return VisaServiceRepository.create({ ...payload, countryId });
};

const getVisaServicesByCountry = async (countryId: string) => {
  const country = await CountryRepository.findById(countryId);
  if (!country) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");

  return VisaServiceRepository.findByCountry(countryId);
};

const getVisaServiceById = async (id: string) => {
  const service = await VisaServiceRepository.findById(id);
  if (!service)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");
  return service;
};

const updateVisaService = async (id: string, payload: any) => {
  if (payload.slug) payload.slug = normalizeSlug(payload.slug);

  // optional: prevent duplicate slug on update
  if (payload.slug) {
    const existing = await VisaServiceRepository.findBySlug(payload.slug);
    if (existing && String(existing._id) !== String(id)) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "VisaService slug already exists",
      );
    }
  }

  const updated = await VisaServiceRepository.updateById(id, payload);
  if (!updated)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");
  return updated;
};

export const VisaServiceService = {
  createVisaServiceForCountry,
  getVisaServicesByCountry,
  getVisaServiceById,
  updateVisaService,
};
