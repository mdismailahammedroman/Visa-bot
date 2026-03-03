import { Server, Socket } from "socket.io";

export const notificationSocket = (io: Server, socket: Socket) => {
  console.log("🔔 Notification module ready:", socket.id);

  socket.on("join-notification", (userId: string) => {
    if (!userId) return;

    socket.join(`notification_${userId}`);
    console.log(`${socket.id} joined notification_${userId}`);
  });

  socket.on("leave-notification", (userId: string) => {
    if (!userId) return;

    socket.leave(`notification_${userId}`);
  });
};