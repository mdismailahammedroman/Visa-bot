/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { StatusCodes } from "http-status-codes";

import { TUpdateUserProfile } from "./user.interface";
import AppError from "../../ErrorHelpers/AppError";
import { User } from "./user.model";

const registerUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.registerUser(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "user registered successfully",
      data: user,
    });
  },
);

const updateUser = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any; // better: custom payload type
  const userId = user.userId; // ✅ correct key

  const allowedFields = [
    "name",
    "profile_picture",
    "coverPicture",
    "mobile",
    "location",
    "gender",
  ] as const;

  const update: Partial<TUpdateUserProfile> = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }
  const result = await userService.updateUser(userId, update);

  sendResponse(res, {
    success: true,
    message: "user update successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

// getByMySelf/

const getByMySelf = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const userId = user.userId;
  const result = await userService.getByMySelf(userId);

  // Optional: password is already hidden by schema
  sendResponse(res, {
    success: true,
    message: "user update successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

// getAllUsers

const getAllUsers = CatchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsersForAdmin(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All users fetched successfully",
    data: users,
  });
});

const getUserProfileByIdForAdmin = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const result = await userService.getUserProfileForAdmin(userId as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  },
);

// userController/

export const userController = {
  registerUser,
  updateUser,
  getByMySelf,
  getAllUsers,
  getUserProfileByIdForAdmin,
};
