import { NotificationRepository } from "./notification.repository";
import { NotificationType } from "./notification.interface";
import { Types } from "mongoose";
import { userRepository } from "../user/user.repository";
import { sendPushNotification } from "../../utils/sendPushNotification";

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

const sendNotificationToUsers = async (
  userIds: string[],
  title: string,
  message: string,
  type: NotificationType
) => {
  const notifications = await Promise.all(
    userIds.map(async (userId) => {
      // Optional: fetch user's push tokens
      const user = await userRepository.findById(userId);
      const tokens = (user?.fcmTokens || []).map((t: string) => t.toString());
      await sendPushNotification(tokens, title, message); // ✅ only 4 arguments
      return await createNotification(userId, title, message, type);
    })
  );
  return notifications;
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
  sendNotificationToUsers,
  getMyNotifications,
  markOneAsRead,
  markAllAsRead,
};
