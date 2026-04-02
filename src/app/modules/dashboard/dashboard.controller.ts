import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getAdminOverview = CatchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAdminOverview();

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Dashboard overview fetched successfully",
    data: result,
  });
});

const getAnalytics = CatchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAnalytics(req.query);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Analytics fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getAdminOverview,
  getAnalytics,
};
