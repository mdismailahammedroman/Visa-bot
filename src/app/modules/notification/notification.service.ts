/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationRepository } from "./notification.repository";

const sendNotification = async (payload: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  metadata?: Record<string, any>;
}) => {
  // 1. Save to Database
  const notification =
    await NotificationRepository.createNotification(payload);

  return notification;
};


const getMyNotifications = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const notifications =
    await NotificationRepository.findUserNotifications(
      userId,
      skip,
      limit
    );

  const total =
    await NotificationRepository.countUserNotifications(userId);

  const unreadCount =
    await NotificationRepository.countUnreadNotifications(userId);

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

const markAsRead = async (
  notificationId: string,
  userId: string
) => {
  return NotificationRepository.updateNotificationAsRead(
    notificationId,
    userId
  );
};

const markAllAsRead = async (userId: string) => {
  return NotificationRepository.updateAllNotificationsAsRead(userId);
};

export const NotificationService = {
  sendNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
