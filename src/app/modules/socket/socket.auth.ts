/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { envVar } from "../../config/EnvVar";

export const socketAuth = (socket: Socket, next: any) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, envVar.JWT_SECRET) as any;

    socket.data.user = decoded;

    next();
  } catch (error) {
    console.error("Socket auth error:", error);

    next(new Error("Authentication failed"));
  }
};
