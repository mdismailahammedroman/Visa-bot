/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from "./notification.model";

const createNotification = async (payload: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  metadata?: Record<string, any>;
}) => {
  return Notification.create({
    userId: payload.userId,
    title: payload.title,
    message: payload.message,
    type: payload.type || "SYSTEM",
    metadata: payload.metadata || {},
  });
}

const findUserNotifications = async (
  userId: string,
  skip: number,
  limit: number
) => {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countUserNotifications = async (userId: string) => {
  return Notification.countDocuments({ userId });
};

const countUnreadNotifications = async (userId: string) => {
  return Notification.countDocuments({ userId, isRead: false });
};

const updateNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

const updateAllNotificationsAsRead = async (userId: string) => {
  return Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

export const NotificationRepository = {
  createNotification,
  findUserNotifications,
  countUserNotifications,
  countUnreadNotifications,
  updateNotificationAsRead,
  updateAllNotificationsAsRead,
};