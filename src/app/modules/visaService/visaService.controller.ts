import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VisaServiceService } from "./visaService.service";
import AppError from "../../ErrorHelpers/AppError";

const createForCountry = CatchAsync(async (req: Request, res: Response) => {
  const countryIdRaw = req.params.countryId;

  // ✅ TS safe guard (avoid string | undefined issue)
  if (!countryIdRaw)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

  const result = await VisaServiceService.createVisaServiceForCountry(
    countryIdRaw,
    req.body,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "VisaService created successfully",
    data: result,
  });
});

const getByCountry = CatchAsync(async (req: Request, res: Response) => {
  const countryIdRaw = req.params.countryId;
  if (!countryIdRaw)
    throw new AppError(StatusCodes.BAD_REQUEST, "countryId is required");

  const result =
    await VisaServiceService.getVisaServicesByCountry(countryIdRa w);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "VisaServices fetched successfully",
    data: result,
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

export const VisaServiceController = {
  createForCountry,
  getByCountry,
  getOne,
  update,
};
