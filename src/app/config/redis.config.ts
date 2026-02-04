/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "redis";
import { envVar } from "./EnvVar";

export const redisClient = createClient({
  username: envVar.REDIS.REDIS_USERNAME,
  password: envVar.REDIS.REDIS_PASSWORD,
  socket: {
    host: envVar.REDIS.REDIS_HOST,
    port: Number(envVar.REDIS.REDIS_PORT),
    // tls: true,
  },
});

redisClient.on("error", (error: any) =>
  console.log("Redis client error", error),
);

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  try {
    if (redisClient?.isOpen) {
      await redisClient.quit(); // graceful shutdown
      console.log("Redis disconnected");
    }
  } catch (error) {
    console.error("Error disconnecting Redis:", error);
  }
};
