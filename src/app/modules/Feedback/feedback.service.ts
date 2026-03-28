/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import { ActivityLogService } from "../activity/activityLog.service";
import { NotificationService } from "../notification/notification.service";
import { IFeedback } from "./feedback.interface";
import { feedbackRepository } from "./feedback.repository";

const createFeedback =  async (payload: IFeedback, user: any, req: any) => {
  const feedback = await feedbackRepository.createFeedback(payload);

  // 🔥 Activity log + notification
  await Promise.all([
    ActivityLogService.logActivity({
      actorId: user._id,
      actorRole: user.role,
      action: "CREATE_FEEDBACK",
      entityType: "Feedback",
      entityId: feedback._id,
      message: `User created feedback: ${feedback.comments}`,
      status: "SUCCESS",
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    }),
    NotificationService.sendNotification({
      userId: user._id.toString(),
      title: "Feedback Created",
      message: "Your feedback has been successfully submitted",
      type: "SYSTEM_UPDATE",
    }),
  ]);

  return feedback;
};

const getUserFeedback = async (userId: string, query: QueryParams) => {
  const baseQuery = feedbackRepository.findByUserId(userId);

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(["comments"])
    .filter()
    .sort()
    .paginate()
    .fields();

  return await queryBuilder.build();
};

const getAllFeedback = async (query: QueryParams) => {
  const baseQuery = feedbackRepository.findAll();

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(["comments"])
    .filter()
    .sort()
    .paginate()
    .fields();

  return await queryBuilder.build();
};

const getFeedbackByVisaApplication = async (feedbackId: string) => {
  return await feedbackRepository.findByFeedbackId(feedbackId);
};

const deleteFeedback = async (id: string, user: any, req: any) => {
  const deleted = await feedbackRepository.deleteFeedback(id);

  // 🔥 Activity log + notification
  await ActivityLogService.logActivity({
    actorId: user._id,
    actorRole: user.role,
    action: "DELETE_FEEDBACK",
    entityType: "Feedback",
    entityId: new Types.ObjectId(id),
    message: `User deleted feedback with ID: ${id}`,
    status: "SUCCESS",
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  return deleted;
};



export const feedbackService = {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  getFeedbackByVisaApplication,
  deleteFeedback,
};