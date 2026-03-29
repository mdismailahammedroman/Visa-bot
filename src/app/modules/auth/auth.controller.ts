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
import { userService } from "../user/user.service";
import { normalizeTokens } from "../../utils/normalizeTokens";
import { ActivityLogService } from "../activity/activityLog.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.interface";

function sanitizeRedirect(input: unknown) {
  if (typeof input !== "string") return "/";

  // ✅ allow only your app scheme
  if (input.startsWith("visabot://callback")) return input;

  // ✅ allow only relative paths for web
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  return input;
}

function encodeState(payload: any) {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf8").toString("base64url");
}
function decodeState(state?: string) {
  if (!state) return null;
  try {
    const json = Buffer.from(state, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}
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

            if (!user.is_verified) {
        return next(
          new AppError(StatusCodes.FORBIDDEN, "Please verify your account before logging in")
        );
      }

      const tokensToAdd = normalizeTokens(req.body.fcmTokens);

      for (const token of tokensToAdd) {
        await userService.saveFCMToken(user._id, token);
      }

      const userTokens = await createUserTokens(user);
      setAuthCookie(res, userTokens);
      // manager online
      if (user.role === "MANAGER") {
        await redisClient.rPush("managerQueue", user._id.toString());
      }

      // 🔥 ACTIVITY + NOTIFICATION (FIXED HERE)
    await Promise.all([
      ActivityLogService.logActivity({
        actorId: user._id,        // ✅ no Types.ObjectId needed
        actorRole: user.role,
        action: "LOGIN",
        entityType: "Auth",
        entityId: user._id,
        message: `User ${user.email} logged in`,
        status: "SUCCESS",
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "",
      }),
    ]);

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
const googleStart = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = sanitizeRedirect(req.query.redirect);
    const state = encodeState({ redirect });

    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
      state,
    })(req, res, next);
  },
);

// ----------------- Google Callback -----------------
const googleCallback = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user?._id)
    throw new AppError(StatusCodes.FORBIDDEN, "Google login failed");

  // handle FCM (query based)
  const tokensToAdd = normalizeTokens(req.query.fcmTokens);

  for (const token of tokensToAdd) {
    await userService.saveFCMToken(user._id, token);
  }

  const userTokens = await createUserTokens(user);
  setAuthCookie(res, userTokens);
  // manager online
  if (user.role === "MANAGER") {
    await redisClient.rPush("managerQueue", user._id.toString());
  }


  // 🔥 ACTIVITY + NOTIFICATION
  await Promise.all([
    ActivityLogService.logActivity({
      actorId: user._id,
      actorRole: user.role,
      action: "GOOGLE_LOGIN",
      entityType: "Auth",
      entityId: user._id,
      message: `User logged in via Google (${user.email})`,
      status: "SUCCESS",
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    }),

  ]);


  const decoded = decodeState(req.query.state as string);

  let redirect = decoded?.redirect;
  if (!redirect || !redirect.startsWith("visabot://")) {
    redirect = "visabot://callback";
  }

  const redirectUri = `${redirect}?token=${userTokens.accessToken}&userId=${user._id}`;

  return res.redirect(redirectUri);
});

// ========================================================================================================================================
//                     use passport to user apple login
// ========================================================================================================================================

const appleStart = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = sanitizeRedirect(req.query.redirect);
    const state = encodeState({ redirect });
    passport.authenticate("apple", {
      session: false,
      scope: ["name", "email"],
      state, // comes back in req.body (form_post) or req.query
    })(req, res, next);
  },
);

const appleCallback = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user?._id)
    throw new AppError(StatusCodes.FORBIDDEN, "Apple login failed");

  // body first (form_post), fallback query
  const tokensToAdd = normalizeTokens(
    req.body?.fcmTokens ?? req.query?.fcmTokens,
  );

  for (const token of tokensToAdd) {
    await userService.saveFCMToken(user._id, token);
  }

  const userTokens = await createUserTokens(user);
  setAuthCookie(res, userTokens);

  // manager online
  if (user.role === "MANAGER") {
    await redisClient.rPush("managerQueue", user._id.toString());
  }

   // 🔥 ACTIVITY + NOTIFICATION
  await Promise.all([
    ActivityLogService.logActivity({
      actorId: user._id,
      actorRole: user.role,
      action: "APPLE_LOGIN",
      entityType: "Auth",
      entityId: user._id,
      message: `User logged in via Apple (${user.email})`,
      status: "SUCCESS",
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    }),

    NotificationService.sendNotification({
      userId: user._id.toString(),
      title: "Apple Login Successful",
      message: "You have successfully logged in using Apple",
      type: "SYSTEM_UPDATE",
    }),
  ]);


  const rawState = req.body?.state ?? req.query?.state;
  const decoded = decodeState(rawState as string);

  let redirect = decoded?.redirect;
  if (!redirect || !redirect.startsWith("visabot://")) {
    redirect = "visabot://callback";
  }

  const redirectUri = `${redirect}?token=${userTokens.accessToken}&userId=${user._id}`;

  return res.redirect(redirectUri);
});

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
  if (payload.role === "MANAGER") {
    await redisClient.lRem("managerQueue", 0, payload.userId);
  }

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
  googleStart,
  googleCallback,
  appleStart,
  appleCallback,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
  logout,
};
