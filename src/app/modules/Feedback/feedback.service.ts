import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import { IFeedback } from "./feedback.interface";
import { feedbackRepository } from "./feedback.repository";

const createFeedback = async (payload: IFeedback) => {
  return await feedbackRepository.createFeedback(payload);
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

const deleteFeedback = async (id: string) => {
  return await feedbackRepository.deleteFeedback(id);
};

export const feedbackService = {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  getFeedbackByVisaApplication,
  deleteFeedback,
};