// src/socket.ts
import { Server } from "socket.io";

export let io: Server | null = null;

export const setIo = (ioInstance: Server) => {
  io = ioInstance;
};
export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.io instance not initialized");
  }
  return io;
};
