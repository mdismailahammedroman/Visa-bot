/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from "./notification.model";

const sendNotification = async (payload: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  metadata?: Record<string, any>;
}) => {
  // 1. Save to Database
  const notification = await Notification.create({
    userId: payload.userId,
    title: payload.title,
    message: payload.message,
    type: payload.type || "SYSTEM",
    metadata: payload.metadata || {},
  });

  return notification;
};


const getMyNotifications = async (userId: string, query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ userId });
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      unreadCount,
    },
    data: notifications,
  };
};

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
  return result;
};

export const NotificationService = {
  sendNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
