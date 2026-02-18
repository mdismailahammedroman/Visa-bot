import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VisaServiceService } from "./visaService.service";
import AppError from "../../ErrorHelpers/AppError";
import { QueryParams } from "../../utils/queryBuilder";

const createForCountry = CatchAsync(async (req: Request, res: Response) => {
  const countryId = req.params.countryId;
  if (!countryId)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

  const result = await VisaServiceService.createVisaServiceForCountry(
    countryId as string,
    req.body,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "VisaService created successfully",
    data: result,
  });
});

// ✅ Pagination: ?page=1&limit=10
const getByCountry = CatchAsync(async (req: Request, res: Response) => {
  const countryId = req.params.countryId;
  if (!countryId)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

  const result = await VisaServiceService.getVisaServicesByCountry(
    countryId as string,
    req.query as QueryParams,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaServices fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getOne = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaServiceService.getVisaServiceById(
    req.params.id as string,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaService fetched successfully",
    data: result,
  });
});

const update = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaServiceService.updateVisaService(
    req.params.id as string,
    req.body,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaService updated successfully",
    data: result,
  });
});

const deleteService = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaServiceService.deleteVisaService(
    req.params.id as string,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaService deleted successfully",
    data: result,
  });
});

export const VisaServiceController = {
  createForCountry,
  getByCountry,
  getOne,
  update,
  delete: deleteService,
};
