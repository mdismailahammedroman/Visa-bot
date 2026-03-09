/* eslint-disable @typescript-eslint/no-explicit-any */

import { redisClient } from "./redis.config";

const CHANNEL = "socket:events";

export const publishSocketEvent = async (event: string, payload: any) => {
  await redisClient.publish(CHANNEL, JSON.stringify({ event, payload }));
};

export const subscribeSocketEvents = async (
  handler: (event: string, payload: any) => void,
) => {
  const subscriber = redisClient.duplicate();

  await subscriber.connect();

  await subscriber.subscribe(CHANNEL, (message) => {
    const data = JSON.parse(message);

    handler(data.event, data.payload);
  });
};
