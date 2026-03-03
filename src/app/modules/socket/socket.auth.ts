/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { envVar } from "../../config/EnvVar";

export const socketAuth = (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, envVar.JWT_SECRET) as any;

    socket.data.user = decoded; // store user in socket

    next();
  } catch (err) {
    console.log(err);
    next(new Error("Authentication failed"));
  }
};
