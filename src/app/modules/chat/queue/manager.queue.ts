import { redisClient } from "../../../config/redis.config";

const MANAGER_QUEUE = "chat:manager_queue";

/**
 * Add manager to queue
 */
export const addManagerToQueue = async (managerId: string) => {
  await redisClient.rPush(MANAGER_QUEUE, managerId);
};

/**
 * Remove manager from queue
 */
export const removeManagerFromQueue = async (managerId: string) => {
  await redisClient.lRem(MANAGER_QUEUE, 0, managerId);
};

/**
 * Get next manager (round robin)
 */
export const getNextManager = async (): Promise<string | null> => {
  const manager = await redisClient.lPop(MANAGER_QUEUE);

  if (!manager) return null;

  // push back for round robin
const exists = await redisClient.lPos(MANAGER_QUEUE, manager);

if (exists === null) {
  await redisClient.rPush(MANAGER_QUEUE, manager);
}

  return manager;
};

/**
 * Queue size
 */
export const getQueueSize = async () => {
  return redisClient.lLen(MANAGER_QUEUE);
};