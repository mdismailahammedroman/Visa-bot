/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendPushToTokens } from "../../utils/sendPushNotification";
import { getIo } from "../socket/socket.store";
import { userRepository } from "../user/user.repository";
import { NotificationRepository } from "./notification.repository";

const sendNotification = async (payload: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  metadata?: Record<string, any>;
}) => {

  // 1️⃣ Save DB
  const notification = await NotificationRepository.createNotification(payload);

  // 2️⃣ Realtime socket
  const io = getIo();
  io.to(`notification_${payload.userId}`).emit("notification", notification);

  // 3️⃣ Get user
  const user = await userRepository.findById(payload.userId);
  if (!user) return notification;

  // ===============================
  // 🔔 PUSH NOTIFICATION CHECK
  // ===============================
  if (user.notificationSettings?.push) {

    const tokens = user.fcmTokens || [];

    if (tokens.length) {
      await sendPushToTokens(
        tokens,
        payload.title,
        payload.message,
        payload.metadata
      );
    }
  }

  // ===============================
  // 📧 EMAIL NOTIFICATION CHECK
  // ===============================
  if (user.notificationSettings?.email) {
    console.log("📧 Sending email...");
    // 👉 এখানে তোমার sendEmail function call করবে
  }

  return notification;
};


const getMyNotifications = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const notifications = await NotificationRepository.findUserNotifications(
    userId,
    skip,
    limit,
  );

  const total = await NotificationRepository.countUserNotifications(userId);

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

const markAsRead = async (notificationId: string, userId: string) => {
  return NotificationRepository.updateNotificationAsRead(
    notificationId,
    userId,
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
