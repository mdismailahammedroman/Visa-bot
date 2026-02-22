/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/visa/visa.controller.ts
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { CatchAsync } from "../../utils/CatchAsync";
import { StatusCodes } from "http-status-codes";
import { VisaService } from "./visa.services";
import AppError from "../../ErrorHelpers/AppError";

const startVisaApplication = CatchAsync(async (req: Request, res: Response) => {
  const userId = req.user as string; // assuming req.user comes from auth middleware
  const result = await VisaService.startApplication(userId);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Visa application started",
    data: result,
  });
});

const updateVisaStep = CatchAsync(async (req: Request, res: Response) => {
  const { visaId } = req.params as any;
  const { stepKey, data } = req.body;
  if (!visaId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Visa ID is required");
  }
  const result = await VisaService.updateStep(visaId, stepKey, data);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Step ${stepKey} updated successfully`,
    data: result,
  });
});

const getVisaApplication = CatchAsync(async (req: Request, res: Response) => {
  const { visaId } = req.params as any;
  const result = await VisaService.getVisaApplication(visaId);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Visa application fetched successfully",
    data: result,
  });
});

export const VisaController = {
  startVisaApplication,
  updateVisaStep,
  getVisaApplication,
};
