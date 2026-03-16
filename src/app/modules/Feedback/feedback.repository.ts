import Feedback from "./feedback.model";
import { IFeedback } from "./feedback.interface";

const createFeedback = async (payload: IFeedback) => {
  return await Feedback.create(payload);
};

const findAll = () => {
  return Feedback.find();
};

const findByUserId = (userId: string) => {
  return Feedback.find({ userId });
};

const findByFeedbackId = (visaApplicationId: string) => {
  return Feedback.find({ visaApplicationId });
};

const deleteFeedback = async (id: string) => {
  return await Feedback.findByIdAndDelete(id);
};

export const feedbackRepository = {
  createFeedback,
  findAll,
  findByUserId,
  findByFeedbackId,
  deleteFeedback,
};
