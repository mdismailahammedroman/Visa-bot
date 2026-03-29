import http from "http";
import { Server as SocketIoServer } from "socket.io";
import app from "./app";

import { connectDB, disconnectDB } from "./app/config/db";
import { envVar } from "./app/config/EnvVar";
import { connectRedis, disconnectRedis } from "./app/config/redis.config";

import { initSockets } from "./app/modules/socket/socket";
import { setIo } from "./app/modules/socket/socket.store";
import { setupSocketRedisAdapter } from "./app/config/redis.adapter";
import logger from "./app/config/logger";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

const server = http.createServer(app);

const io = new SocketIoServer(server, {
  cors: {
    origin: envVar.FRONTEND_URL,
    credentials: true,
  },
});

// 🔑 Bootstrap server
async function bootstrap() {
  await connectDB();
  await connectRedis();
  // 🔥 Seed Super Admin after DB connected
  await seedSuperAdmin();
  // 🔥 IMPORTANT ORDER
  setIo(io);

  await setupSocketRedisAdapter(io);

  initSockets(io);

  // await seedSuperAdmin();

  server.listen(envVar.PORT, () => {
    logger.info(`🚀 Server started ${envVar.PORT}`, {
      port: envVar.PORT,
      env: process.env.NODE_ENV,
    });
  });
}

bootstrap().catch((err) => {
  logger.error("❌ Failed to start server:", err);
  process.exit(1);
});

let isShuttingDown = false;

async function shutdown(exitCode: number, reason?: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`🧩 Shutting down... ${reason ?? ""}`.trim());

  server.close(async () => {
    try {
      io.close();
      await disconnectDB();
      await disconnectRedis();
      logger.info("✅ Server closed gracefully.");
      process.exit(exitCode);
    } catch (e) {
      logger.error("❌ Shutdown cleanup failed:", e);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("⏳ Force shutdown (timeout).");
    process.exit(1);
  }, 10_000).unref();
}

process.on("uncaughtException", (err) => {
  logger.error("💥 Uncaught Exception!", err);
  shutdown(1, "uncaughtException");
});

process.on("unhandledRejection", (err) => {
  logger.error("⚠️ Unhandled Rejection!", err);
  shutdown(1, "unhandledRejection");
});

process.on("SIGTERM", () => shutdown(0, "SIGTERM"));
process.on("SIGINT", () => shutdown(0, "SIGINT"));
