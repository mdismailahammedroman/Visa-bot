import express, { type Application } from "express";
import http from "http";
import { connectDB } from "./app/config/db.js";
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
async () => {
  await connectDB();
};

export default app;
