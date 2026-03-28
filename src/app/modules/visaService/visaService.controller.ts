/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VisaServiceService } from "./visaService.service";
import AppError from "../../ErrorHelpers/AppError";
import { QueryParams } from "../../utils/queryBuilder";

const createForCountry = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const userId = user._id;
  const countryId = req.params.countryId;
  if (!countryId)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

  const result = await VisaServiceService.createVisaServiceForCountry(
    countryId as string,
    {
      ...req.body,
      createdBy: userId,
    },
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "VisaService created successfully",
    data: result,
  });
});

//  Pagination: ?page=1&limit=10
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
  const user = req.user as any;
  const result = await VisaServiceService.updateVisaService(
    req.params.id as string,
    req.body,
    { id: user._id, role: user.role },
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaService updated successfully",
    data: result,
  });
});

/**
 * delete service
 */

const deleteService = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await VisaServiceService.deleteVisaService(
    req.params.id as string,
    { id: user._id, role: user.role },
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaService deleted successfully",
    data: result,
  });
});

/**
 * getByCategory
 */
const getByCategory = CatchAsync(async (req: Request, res: Response) => {
  const { countryId, category } = req.params;

  if (!countryId)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");
  if (!category)
    throw new AppError(StatusCodes.BAD_REQUEST, "category is required");

  const result = await VisaServiceService.getVisaServicesByCategory(
    countryId as string,
    category as string,
    req.query as QueryParams,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `VisaServices for category ${category} fetched successfully`,
    data: result.data,
    meta: result.meta,
  });
});
/**
 * get all visa services
 */
const getAllVisaServicesController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await VisaServiceService.getAllVisaServices(
      req.query as QueryParams,
    );

    return sendResponse(res, {
      success: true,
      message: "Retrieve all visa services",
      statusCode: StatusCodes.OK,
      data: result.data,
      meta: result.meta,
    });
  },
);

/**+
 * searchVisaServicesController
 */

const searchVisaServicesController = CatchAsync(
  async (req: Request, res: Response) => {
    const countryId = req.query.countryId as string | undefined; // optional
    const result = await VisaServiceService.searchVisaServices(req.query as QueryParams, countryId);

    return sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "VisaServices fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const updateStatus = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body; // true বা false পাঠাবে

  if (typeof isActive !== "boolean") {
    throw new AppError(StatusCodes.BAD_REQUEST, "isActive must be boolean");
  }

  const updatedService = await VisaServiceService.updateStatus(
    id as string,
    isActive,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `VisaService status updated to ${isActive ? "Active" : "Inactive"}`,
    data: updatedService,
  });
});

export const VisaServiceController = {
  createForCountry,
  getByCountry,
  getOne,
  update,
  updateStatus,
  delete: deleteService,
  searchVisaServicesController,
  getAllVisaServicesController,
  getByCategory,
};
