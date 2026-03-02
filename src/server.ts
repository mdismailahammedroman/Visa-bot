import http from "http";
import { Server as SocketIoServer } from "socket.io";
import app from "./app";
import { connectDB, disconnectDB } from "./app/config/db";
import { envVar } from "./app/config/EnvVar";
import { setIo } from "./app/config/socket";
import { connectRedis, disconnectRedis } from "./app/config/redis.config";

const server = http.createServer(app);

// 🔌 Socket.io setup
const io = new SocketIoServer(server, {
  cors: {
    origin: envVar.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
setIo(io);

// 🔑 Bootstrap server
async function bootstrap() {
  await connectDB();
  await connectRedis();
  // await seedSuperAdmin();

  server.listen(envVar.PORT, () =>
    console.log(`🚀 Server running on port ${envVar.PORT}`),
  );
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

let isShuttingDown = false;

async function shutdown(exitCode: number, reason?: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`🧩 Shutting down... ${reason ?? ""}`.trim());

  server.close(async () => {
    try {
      io.close();
      await disconnectDB();
      await disconnectRedis();
      console.log("✅ Server closed gracefully.");
      process.exit(exitCode);
    } catch (e) {
      console.error("❌ Shutdown cleanup failed:", e);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("⏳ Force shutdown (timeout).");
    process.exit(1);
  }, 10_000).unref();
}

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception!", err);
  shutdown(1, "uncaughtException");
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection!", err);
  shutdown(1, "unhandledRejection");
});

process.on("SIGTERM", () => shutdown(0, "SIGTERM"));
process.on("SIGINT", () => shutdown(0, "SIGINT"));
