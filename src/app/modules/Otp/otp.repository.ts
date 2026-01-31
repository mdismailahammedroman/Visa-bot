import { redisClient } from "../../config/redis.config";
import { OtpRecord } from "./otp.interface";

const getKey = (email: string, purpose: string) =>
  `otp:${purpose}:${email.toLowerCase()}`;

const setOtpRecord = async (record: OtpRecord, ttlSec: number) => {
  const key = getKey(record.email, record.purpose);
  await redisClient.set(key, JSON.stringify(record), { EX: ttlSec });
};

const getOtpRecord = async (
  email: string,
  purpose: string,
): Promise<OtpRecord | null> => {
  const key = getKey(email, purpose);
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const deleteOtpRecord = async (email: string, purpose: string) => {
  const key = getKey(email, purpose);
  await redisClient.del(key);
};

export const otpRepository = {
  setOtpRecord,
  getOtpRecord,
  deleteOtpRecord,
};
