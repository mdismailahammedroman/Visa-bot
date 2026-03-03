import { NotificationModel } from "./notification.model";
import { INotification } from "./notification.interface";

const create = (payload: INotification) =>
  NotificationModel.create(payload);

const findByUserId = (userId: string) =>
  NotificationModel.find({ userId }).sort({ createdAt: -1 });

const markAsRead = (id: string) =>
  NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });

const markAllAsRead = (userId: string) =>
  NotificationModel.updateMany({ userId }, { isRead: true });

export const NotificationRepository = {
  create,
  findByUserId,
  markAsRead,
  markAllAsRead,
};