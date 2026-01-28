import express, { type Application } from "express";
import http from "http";
import { connectDB } from "./app/config/db";
import { Server as SocketIoServer } from "socket.io";

const app: Application = express();

let server = http.createServer(app);
const io = new SocketIoServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("New Client connected", socket.id);
  socket.on("message", (data) => {
    console.log("Message received from client:", data);
    socket.emit("message", `Hello from server, received your message: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

(async () => {
  await connectDB();
})();
// ---------------- Global Error & Shutdown Handlers ----------------

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception! Server shutting down.", err);
  shutdown(1);
});

process.on("unhandledRejection", (error) => {
  console.error("⚠️ Unhandled Rejection! Server shutting down.", error);
  shutdown(1);
});

process.on("SIGTERM", (signal) => {
  console.log("🧩 SIGTERM received. Shutting down gracefully.", signal);
  shutdown(0);
});

process.on("SIGINT", (signal) => {
  console.log("🧩 SIGINT received (Ctrl+C). Shutting down.", signal);
  shutdown(0);
});

function shutdown(exitCode: number) {
  if (server) {
    server.close(() => {
      console.log("✅ Server closed.");
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}
