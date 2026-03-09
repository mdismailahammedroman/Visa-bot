import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { Server } from "socket.io";
import { envVar } from "./EnvVar";


export const setupSocketRedisAdapter = async (io: Server) => {
  const pubClient = createClient({
    username: envVar.REDIS.REDIS_USERNAME,
    password: envVar.REDIS.REDIS_PASSWORD,
    socket: {
      host: envVar.REDIS.REDIS_HOST,
      port: Number(envVar.REDIS.REDIS_PORT),
    },
  });

  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  console.log("🔁 Socket Redis adapter initialized");
};