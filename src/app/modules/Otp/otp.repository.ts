import { redisClient } from "../../config/redis.config";
import { OtpRecord } from "./otp.interface";

const setOtpRecord = async (record: OtpRecord, ttlSec: number) => {
  const key = `otp:${record.email}`;
  await redisClient.set(key, JSON.stringify(record), { EX: ttlSec });
};

const getOtpRecord = async (email: string): Promise<OtpRecord | null> => {
  const key = `otp:${email}`; // fixed
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const deleteOtpRecord = async (email: string) => {
  const key = `otp:${email}`;
  await redisClient.del(key);
};

export const otpRepository = {
  setOtpRecord,
  getOtpRecord,
  deleteOtpRecord,
};
