/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { fcmMessaging } from "../config/firebase.config";
import AppError from "../ErrorHelpers/AppError";


interface PushResult {
  successCount: number;
  failureCount: number;
}


const normalizeData = (data: Record<string, any> = {}) => {
  const normalized: Record<string, string> = {};

  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    normalized[k] = typeof v === "string" ? v : String(v);
  });

  return normalized;
};

export const sendPushNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, any> = {},
) : Promise<PushResult> => {
  if (!tokens?.length) {
    return { successCount: 0, failureCount: 0 };
  }

  const uniqueTokens = [...new Set(tokens)];

  try {
    const response = await fcmMessaging().sendEachForMulticast({
      tokens: uniqueTokens,
      notification: { title, body },
      data: normalizeData(data),
    });

    return response;
  } catch {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send push notification",
    );
  }
};