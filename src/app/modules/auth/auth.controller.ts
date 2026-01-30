/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { createUserTokens } from "../../utils/authToken";
import { sendResponse } from "../../utils/sendResponse";
import { CatchAsync } from "../../utils/CatchAsync";

export const credentialLogin = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) return next(err);

      if (!user) {
        return next(
          new AppError(StatusCodes.FORBIDDEN, info?.message || "Login failed"),
        );
      }

      // create access + refresh tokens
      const userTokens = await createUserTokens(user);

      // TODO: add login activity logic here

      // send response with tokens
      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Login successful",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
        },
      });
    })(req, res, next);
  },
);

export const authController = {
  credentialLogin,
};
