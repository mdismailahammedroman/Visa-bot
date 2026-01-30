import { Request, Response } from "express";
import { notifyAllUsers } from "./socket.service";

export const socketNotification = (req: Request, res: Response) => {
  notifyAllUsers();

  res.status(200).json({
    success: true,
    message: "Notification sent to all users",
  });
};
