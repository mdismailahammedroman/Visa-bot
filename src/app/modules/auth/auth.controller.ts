/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

import { sendResponse } from "../../utils/sendResponse";
import { CatchAsync } from "../../utils/CatchAsync";
import { authService } from "./auth.service";
import { clearAuthCookies, setAuthCookie } from "../../utils/setAuthCookies";
import { createUserTokens } from "../../utils/authToken";
import { JwtPayload } from "../../types/auth.types";
import { redisClient } from "../../config/redis.config";
import { envVar } from "../../config/EnvVar";

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
      // ✅ set cookies
      setAuthCookie(res, userTokens);

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

// Forgot password
const forgotPassword = CatchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP sent successfully",
    data: result,
  });
});

// Verify OTP
const verifyOTP = CatchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTPForPassword(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verified successfully",
    data: result,
  });
});

// Reset password
const resetPassword = CatchAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const result = await authService.resetPassword(email, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset successfully",
    data: result,
  });
});

// Change password
const changePassword = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;

  const { oldPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    userId,
    oldPassword,
    newPassword,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
    data: result,
  });
});

// Logout
const logout = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.user as any;

  await redisClient.del(`refresh:${payload.userId}`);

  const isProduction = envVar.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Logout successful",
    data: null,
  });
});

export const authController = {
  credentialLogin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
  logout,
};
