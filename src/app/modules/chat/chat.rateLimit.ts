import { redisClient } from "../../config/redis.config";

export const checkChatRateLimit = async (userId: string) => {

  const key = `rate:chat:${userId}`;

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, 5);
  }

  if (count > 10) {
    throw new Error("Too many messages. Please slow down.");
  }

};

