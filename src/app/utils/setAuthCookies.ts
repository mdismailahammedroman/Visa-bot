import { Response } from "express";
import { envVar } from "../config/EnvVar";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const getCookieOptions = () => {
  const isProduction = envVar.NODE_ENV === "production";

  // Development = ngrok backend + localhost frontend (always cross-origin)
  // Production = your real domain
  // Both need secure + sameSite none
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
  };
};

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  const options = getCookieOptions();

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      ...options,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};

export const clearAuthCookies = (res: Response) => {
  const options = getCookieOptions();
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};