/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotificationService } from "./notification.service";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getMyNotifications = CatchAsync(async (req: Request, res: Response) => {
    const user = req.user as any; // better: custom payload type
    const userId = user._id; // ✅ correct key

  const result = await NotificationService.getMyNotifications(
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const markAsRead = CatchAsync(async (req: Request, res: Response) => {
  const { notificationId } = req.body;

  const result = await NotificationService.markOneAsRead(notificationId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Notification marked as read",
    data: result,
  });
});

const markAllAsRead = CatchAsync(async (req: Request, res: Response) => {
    const user = req.user as any; // better: custom payload type
    const userId = user._id; // ✅ correct key

  await NotificationService.markAllAsRead(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All notifications marked as read",
  });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
