/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import { NotificationService } from "./notification.service";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getMyNotifications = CatchAsync(async (req: Request, res: Response) => {
  const user=req.user as any
  const userId =user._id
  const result = await NotificationService.getMyNotifications(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const markAsRead = CatchAsync(async (req: Request, res: Response) => {
  const user=req.user as any
  const userId=user._id
  const result = await NotificationService.markAsRead(req.params.id as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification marked as read successfully",
    data: result,
  });
});

const markAllAsRead = CatchAsync(async (req: Request, res: Response) => {
  const user=req.user as any
  const userId=user._id
  const result = await NotificationService.markAllAsRead(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notifications marked as read successfully",
    data: result,
  });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
