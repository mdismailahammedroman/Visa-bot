/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { StatusCodes } from "http-status-codes";

import { Role, TUpdateUserProfile, UserStatus } from "./user.interface";
import AppError from "../../ErrorHelpers/AppError";

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

// Change user status (BLOCK, ACTIVE, SUSPEND)
const setUserStatus = CatchAsync(async (req: Request, res: Response) => {
  const adminUser = req.user as any;
  const { userId } = req.params;
  const { status } = req.body; // should be one of UserStatus

  if (!Object.values(UserStatus).includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status");
  }

  const updatedUser = await userService.changeUserStatus(
    adminUser,
    userId as string,
    status,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `User status updated to ${status}`,
    data: updatedUser,
  });
});

// Change user role (ADMIN,  etc.)
const setUserRole = CatchAsync(async (req: Request, res: Response) => {
  const adminUser = req.user as any;
  const { userId } = req.params;
  const { role } = req.body; // should be one of Role

  if (!Object.values(Role).includes(role)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid role");
  }

  const updatedUser = await userService.changeUserRole(
    adminUser,
    userId as string,
    role,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `User role updated to ${role}`,
    data: updatedUser,
  });
});

const deleteMyAccount = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  await userService.deleteMyAccount(user.userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Account deleted",
    data: null,
  });
});
// userController/

export const userController = {
  registerUser,
  setUserStatus,
  setUserRole,
  updateUser,
  getByMySelf,
  getAllUsers,
  getUserProfileByIdForAdmin,
  deleteMyAccount,
};
