import { NotificationService } from './../notification/notification.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisaServiceRepository } from "./visaService.repository";
import { CountryRepository } from "../country/country.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import { VisaCategoryEnum, VisaTypeEnum } from "./visaService.interface";


/// Helper function to normalize and validate slugs
const normalizeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
const normalizeEnum = (val: string, enumObj: any) => {
  if (!val) return val;
  const upperVal = val.toString().toUpperCase().replace(/ /g, "_");
  if (!Object.values(enumObj).includes(upperVal)) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Invalid enum value: ${val}`);
  }
  return upperVal;
};

const createVisaServiceForCountry = async (
  countryId: string,
  payload: any,

) => {
  const country = await CountryRepository.findById(countryId);
  if (!country) throw new AppError(StatusCodes.NOT_FOUND, "Country not found");

  // slug, enum normalization, totalFee etc (তোমার আগের logic)
  if (!payload.slug) {
    if (!payload.serviceName)
      throw new AppError(StatusCodes.BAD_REQUEST, "serviceName is required");
    payload.slug = `${normalizeSlug(country.countryName)}-${normalizeSlug(
      payload.serviceName,
    )}`;
  } else payload.slug = normalizeSlug(payload.slug);

  if (payload.visaCategories)
    payload.visaCategories = normalizeEnum(
      payload.visaCategories,
      VisaCategoryEnum,
    );

  if (payload.visaType)
    payload.visaType = normalizeEnum(payload.visaType, VisaTypeEnum);

  if (payload.visaFee !== undefined && payload.serviceFee !== undefined)
    payload.totalFee = payload.visaFee + payload.serviceFee;

  // duplicate check
  const existing = await VisaServiceRepository.findBySlugAndCountry(
    payload.slug,
    countryId,
  );
  if (existing)
    throw new AppError(
      StatusCodes.CONFLICT,
      "This slug already exists in this country",
    );

  // create service
  const result = await VisaServiceRepository.create({ ...payload, countryId });

  /**
   * 🔔 Notification Trigger
   */
  await NotificationService.sendNotification({
    userId: payload.createdBy, // or adminId / system user
    title: "New Visa Service Added",
    message: `${payload.serviceName} service added for ${country.countryName}`,
    type: "SYSTEM_UPDATE",
    metadata: {
      serviceId: result._id,
      countryId,
      serviceName: payload.serviceName,
    },
  });

  return result;
};

const updateVisaService = async (id: string, payload: any) => {
  const existing = await VisaServiceRepository.findById(id);
  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa Service not found");
  }

  if (payload.slug) {
    payload.slug = normalizeSlug(payload.slug);

    const duplicate = await VisaServiceRepository.findBySlugAndCountry(
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
};

const updateStatus = async (id: string, isActive: boolean) => {
  const service = await VisaServiceRepository.findById(id);
  if (!service)
    throw new AppError(StatusCodes.NOT_FOUND, "VisaService not found");

  service.isActive = isActive;
  await service.save();
  return service;
};

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

const getAllVisaServices = async (queryParams: QueryParams = {}) => {
  return await VisaServiceRepository.findAllVisaServices(queryParams);
};

const searchVisaServices = async (
  countryId: string,
  queryParams: QueryParams = {},
) => {
  const baseQuery = VisaServiceRepository.findByCountry(countryId);
  const qb = new QueryBuilder(baseQuery, queryParams)
    .search(["serviceName", "slug", "visaCategories", "visaType"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await qb.build();
  return result;
};

export const VisaServiceService = {
  createVisaServiceForCountry,
  getVisaServicesByCountry,
  getVisaServiceById,
  updateVisaService,
  updateStatus,
  deleteVisaService,
  getAllVisaServices,
  searchVisaServices,
};
