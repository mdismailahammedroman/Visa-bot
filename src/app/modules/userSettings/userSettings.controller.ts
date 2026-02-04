/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { userSettingsService } from "./userSettings.service";

const getMySettings = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const settings = await userSettingsService.getMySettings(userId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User settings fetched successfully",
      data: settings,
    });
  },
);

const updateMySettings = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user.userId;
    const payload = req.body;

    const settings = await userSettingsService.updateMySettings(
      userId,
      payload,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User settings updated successfully",
      data: settings,
    });
  },
);

export const userSettingsController = {
  getMySettings,
  updateMySettings,
};
