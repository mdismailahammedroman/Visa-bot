import { Server, Socket } from "socket.io";

export const chatSocket = (io: Server, socket: Socket) => {
  console.log("💬 Chat module ready:", socket.id);

  socket.on("join-chat", (userId: string) => {
    if (!userId) return;

    socket.join(`chat_${userId}`);
    console.log(`${socket.id} joined chat_${userId}`);
  });

  socket.on("leave-chat", (userId: string) => {
    if (!userId) return;

    socket.leave(`chat_${userId}`);
  });
};