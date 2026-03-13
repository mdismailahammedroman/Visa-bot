import { redisClient } from "../../config/redis.config";

export const trackManagerReply = async (managerId: string) => {
  const key = `metrics:manager:${managerId}:replies`;

  await redisClient.incr(key);
};