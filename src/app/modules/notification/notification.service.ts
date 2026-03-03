import { NotificationRepository } from "./notification.repository";
import { NotificationType } from "./notification.interface";
import { Types } from "mongoose";

const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
) => {
  // Convert string to ObjectId
  const userObjectId = new Types.ObjectId(userId);

  return await NotificationRepository.create({
    userId: userObjectId, // Store it as ObjectId

    title,
    message,
    type,
    isRead: false,
  });
};

const getMyNotifications = async (userId: string) => {
  return await NotificationRepository.findByUserId(userId);
};

const markOneAsRead = async (id: string) => {
  return await NotificationRepository.markAsRead(id);
};

const markAllAsRead = async (userId: string) => {
  return await NotificationRepository.markAllAsRead(userId);
};

export const NotificationService = {
  createNotification,
  getMyNotifications,
  markOneAsRead,
  markAllAsRead,
};
