/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VisaServiceService } from "./visaService.service";
import AppError from "../../ErrorHelpers/AppError";
import { QueryParams } from "../../utils/queryBuilder";
import { ActivityLogService } from "../activity/activityLog.service";

const createForCountry = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const usreId = user._id;
  const role = user.role;
  const countryId = req.params.countryId;
  if (!countryId)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

const result = await VisaServiceService.createVisaServiceForCountry(
  countryId as string,
  {
    ...req.body,
    createdBy: usreId,
  }
);

  await ActivityLogService.logActivity({
    actorId: usreId,
    actorRole: role,
    action: "CREATE_VISA_SERVICE",
    entityType: "VisaService",
    entityId: result._id, // <-- ObjectId use করতে হবে
    message: `Created visa service ${result.serviceName}`,
    after: {
      _id: result._id,
      serviceName: result.serviceName,
      slug: result.slug,
      visaFee: result.visaFee,
    },
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
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

/**
 * delete service
 */

const deleteService = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaServiceService.deleteVisaService(
    req.params.id as string,
  );
  //   await ActivityLogService.logActivity({
  //   actorId: usreId,
  //   actorRole: role,
  //   action: "DELETE_VISA_SERVICE",
  //   entityType: "VisaService",
  //   entityId: req.params.id,
  //   message: `Deleted visa service with id ${req.params.id}`,
  //   before: result,
  //   ip: req.ip,
  //   userAgent: req.get("user-agent"),
  // });
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
    const countryId = req.params.countryId;
    if (!countryId)
      throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

    const result = await VisaServiceService.searchVisaServices(
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
  },
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
};
