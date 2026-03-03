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

// Admin route: send notification to users
const sendNotificationToUsers = CatchAsync(async (req: Request, res: Response) => {
  const { userIds, title, message, type } = req.body;

  if (!userIds?.length || !title || !message || !type) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Missing required fields",
    });
  }

  const result = await NotificationService.sendNotificationToUsers(
    userIds,
    title,
    message,
    type
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Notifications sent successfully",
    data: result,
  });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  sendNotificationToUsers,
};
