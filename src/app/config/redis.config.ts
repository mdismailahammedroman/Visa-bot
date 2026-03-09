import { createClient, RedisClientType } from "redis";
import { envVar } from "./EnvVar";

export let redisClient: RedisClientType;

export const connectRedis = async () => {
  if (redisClient?.isOpen) return redisClient;

  redisClient = createClient({
    username: envVar.REDIS.REDIS_USERNAME,
    password: envVar.REDIS.REDIS_PASSWORD,
    socket: {
      host: envVar.REDIS.REDIS_HOST,
      port: Number(envVar.REDIS.REDIS_PORT),
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
  });

  redisClient.on("connect", () => console.log("✅ Redis connected"));
  redisClient.on("error", (err) => console.error("Redis error:", err));

  await redisClient.connect();
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient?.isOpen) await redisClient.quit();
};

/**
 * Cache Helpers
 */

export const setCache = async (
  key: string,
  value: unknown,
  ttl?: number
) => {
  const data = JSON.stringify(value);

  if (ttl) {
    await redisClient.set(key, data, { EX: ttl });
  } else {
    await redisClient.set(key, data);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redisClient.get(key);

  if (!data) return null;

  return JSON.parse(data) as T;
};

export const deleteCache = async (key: string) => {
  await redisClient.del(key);
};