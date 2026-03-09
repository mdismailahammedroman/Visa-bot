import { redisClient } from "../../../config/redis.config";

const ONLINE_MANAGERS = "chat:online_managers";

/**
 * Manager online
 */
export const setManagerOnline = async (managerId: string) => {
  await redisClient.sAdd(ONLINE_MANAGERS, managerId);
};

/**
 * Manager offline
 */
export const setManagerOffline = async (managerId: string) => {
  await redisClient.sRem(ONLINE_MANAGERS, managerId);
};

/**
 * Get all online managers
 */
export const getOnlineManagers = async () => {
  return redisClient.sMembers(ONLINE_MANAGERS);
};

/**
 * Check if manager online
 */
export const isManagerOnline = async (managerId: string) => {
  return redisClient.sIsMember(ONLINE_MANAGERS, managerId);
};