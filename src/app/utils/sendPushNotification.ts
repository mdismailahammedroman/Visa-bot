import { messaging } from "firebase-admin";
import { fcmMessaging } from "../config/firebase.config";

/* eslint-disable @typescript-eslint/no-explicit-any */
const toStringMap = (data?: Record<string, any>): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!data) return out;
  for (const k of Object.keys(data)) {
    const v = data[k];
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
};

// Explicit return type using Firebase types
export const sendPushToTokens = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<messaging.BatchResponse> => {
  if (!tokens?.length) {
    // Return empty BatchResponse-like object
    return {
      responses: [],
      successCount: 0,
      failureCount: 0,
    };
  }

  const res = await fcmMessaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data: toStringMap(data),
  });

  return res;
};