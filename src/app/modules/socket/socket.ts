import { Server, Socket } from "socket.io";
import { chatSocket } from "./chat.socket";
import { notificationSocket } from "./notification.socket";


import {
  setManagerOnline,
  setManagerOffline,
} from "../chat/queue/manager.presence";

import {
  addManagerToQueue,
  removeManagerFromQueue,
} from "../chat/queue/manager.queue";
import logger from "../../config/logger";

export const initSockets = (io: Server) => {


  io.on("connection", async (socket: Socket) => {
    logger.info("🔥 Client connected:", socket.id);

    const user = socket.data.user;

    /**
     * USER ROOM
     */
    if (user?._id) {
      socket.join(`user_${user._id}`);
    }

    /**
     * MANAGER ONLINE
     */
    if (user?.role === "MANAGER") {
      try {
        await setManagerOnline(user._id);

        await addManagerToQueue(user._id);

        console.log(`🟢 Manager online: ${user._id}`);
      } catch (error) {
        console.error("Manager presence error:", error);
      }
    }

    /**
     * Activate socket modules
     */

    chatSocket(io, socket);
    notificationSocket(io, socket);

    /**
     * DISCONNECT
     */

    socket.on("disconnect", async () => {
      logger.log("❌ Client disconnected:", socket.id);

      if (user?.role === "MANAGER") {
        try {
          await setManagerOffline(user._id);

          await removeManagerFromQueue(user._id);

        } catch (error) {
          logger.error("Manager offline cleanup error:", error);
        }
      }
    });
  });
};