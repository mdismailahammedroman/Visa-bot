/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { createUserTokens } from "../../utils/authToken";
import { sendResponse } from "../../utils/sendResponse";
import { CatchAsync } from "../../utils/CatchAsync";
import { authService } from "./auth.service";

// ========================================================================================================================================
//                     use passport to user credentialLogin
// ========================================================================================================================================

const credentialLogin = CatchAsync(
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

// ========================================================================================================================================
//                     use passport to user google login
// ========================================================================================================================================

// ========================================================================================================================================
//                     use passport to user apple login
// ========================================================================================================================================

// ========================================================================================================================================
//                     forgot password controller
// ========================================================================================================================================
const forgotPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Forgot password endpoint working",
      data: result,
    });
  },
);

const resetPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword } = req.body;
    await authService.resetPassword(email, newPassword);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password reset successful",
      data: null,
    });
  },
);
export const authController = {
  credentialLogin,
  forgotPassword,
  resetPassword,
};
