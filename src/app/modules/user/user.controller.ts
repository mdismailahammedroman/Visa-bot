import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { StatusCodes } from "http-status-codes";

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

export const userController = {
  registerUser,
};
