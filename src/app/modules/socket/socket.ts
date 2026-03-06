import { Server, Socket } from "socket.io";
import { chatSocket } from "./chat.socket";
import { notificationSocket } from "./notification.socket";
import { socketAuth } from "./socket.auth";

export const initSockets = (io: Server) => {
  io.use(socketAuth);
  io.on("connection", (socket: Socket) => {
    console.log("🔥 Client connected:", socket.id);

    // Activate modules
    chatSocket(io, socket);
    notificationSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
