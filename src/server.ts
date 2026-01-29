import http from "http";
import { Server as SocketIoServer } from "socket.io";
import app from "./app";
import { connectDB, disconnectDB } from "./app/config/db";
import { envVar } from "./app/config/EnvVar";
import { setIo } from "./app/config/socket";

const server = http.createServer(app);

const io = new SocketIoServer(server, {
  cors: {
    origin: envVar.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setIo(io);

io.on("connection", (socket) => {
  console.log("✅ New Client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("📩 Message received:", data);
    socket.emit("message", `Hello from server: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

async function bootstrap() {
  await connectDB();
  server.listen(envVar.PORT, () =>
    console.log(`🚀 Server running on port ${envVar.PORT}`),
  );
}

bootstrap();

let isShuttingDown = false;

async function shutdown(exitCode: number, reason?: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`🧩 Shutting down... ${reason ?? ""}`.trim());

  server.close(async () => {
    try {
      io.close();
      await disconnectDB();
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
