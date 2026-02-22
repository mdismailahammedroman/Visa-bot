/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, RedisClientType } from "redis";
import { envVar } from "./EnvVar";

export let redisClient: RedisClientType<any, any>;

export const connectRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      username: envVar.REDIS.REDIS_USERNAME,
      password: envVar.REDIS.REDIS_PASSWORD,
      socket: {
        host: envVar.REDIS.REDIS_HOST,
        port: Number(envVar.REDIS.REDIS_PORT),
        // Reconnect strategy
        reconnectStrategy: (retries: number) => Math.min(retries * 100, 3000),
      },
    });

    redisClient.on("connect", () => console.log("✅ Redis connected"));
    redisClient.on("ready", () => console.log("Redis ready for commands"));
    redisClient.on("error", (err: any) => console.error("Redis error:", err));
    redisClient.on("end", () => console.log("Redis connection closed"));
    redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));

    await redisClient.connect();
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  try {
    if (redisClient?.isOpen) {
      await redisClient.quit();
      console.log("✅ Redis disconnected");
    }
  } catch (error) {
    console.error("❌ Error disconnecting Redis:", error);
  }
};

// ------------------ Helpers ------------------

// Set key with optional TTL
export const setRedisKey = async (key: string, value: string, ttl?: number) => {
  if (!redisClient?.isOpen) await connectRedis();
  if (ttl) {
    await redisClient.set(key, value, { EX: ttl });
  } else {
    await redisClient.set(key, value);
  }
};

// Get key
export const getRedisKey = async (key: string) => {
  if (!redisClient?.isOpen) await connectRedis();
  return await redisClient.get(key);
};

// Delete key
export const deleteRedisKey = async (key: string) => {
  if (!redisClient?.isOpen) await connectRedis();
  return await redisClient.del(key);
};

// Pipeline helper for multiple commands
export const redisPipeline = async (commands: Array<[string, ...any[]]>) => {
  if (!redisClient?.isOpen) await connectRedis();

  const pipeline = redisClient.multi();

  // Use addCommand for dynamic commands in redis v5
  commands.forEach((cmd) => pipeline.addCommand(cmd));

  const results = await pipeline.exec();
  return results;
};
