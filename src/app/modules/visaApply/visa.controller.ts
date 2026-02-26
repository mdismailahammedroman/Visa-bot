/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VisaApplicationService } from "./visa.services";

const apply = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { visaServiceId } = req.params;

  const result = await VisaApplicationService.applyVisaService(
    user.userId,
    visaServiceId as string,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Visa application draft created",
    data: result,
  });
});

const updateDraft = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await VisaApplicationService.updateApplicationDraft(
    user.userId,
    req.params.id as string,
    req.body,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Draft updated",
    data: result,
  });
});

const submit = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await VisaApplicationService.submitApplication(
    user.userId,
    req.params.id as string,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Application submitted",
    data: result,
  });
});

const pay = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await VisaApplicationService.markAsPaid(
    user.userId,
    req.params.id as string,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment marked as paid",
    data: result,
  });
});

const myApplications = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await VisaApplicationService.getMyApplications(user.userId);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "My applications",
    data: result,
  });
});

const getAllForManager = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaApplicationService.getAllApplicationsForManager(
    req.query,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All applications fetched",
    data: result.data,
    meta: result.meta,
  });
});

const getOneForManager = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaApplicationService.getApplicationByIdForManager(
    req.params.id as string,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Application fetched",
    data: result,
  });
});

const updateStatus = CatchAsync(async (req: Request, res: Response) => {
  const manager = req.user as any;
  const { status } = req.body; // "Processing" | "Approved" | "Rejected"

  const result = await VisaApplicationService.updateApplicationStatus(
    manager,
    req.params.id as string,
    status,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Application status updated to ${status}`,
    data: result,
  });
});

export const VisaApplicationController = {
  // user controllers:
  apply,
  updateDraft,
  submit,
  pay,
  myApplications,

  // manager controllers:
  getAllForManager,
  getOneForManager,
  updateStatus,
};
