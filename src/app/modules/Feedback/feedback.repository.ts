import Feedback from "./feedback.model";
import { IFeedback } from "./feedback.interface";

const createFeedback = async (payload: IFeedback) => {
  return await Feedback.create(payload);
};

const findAll = () => {
  return Feedback.find()
    .populate("userId")
    .populate("visaApplicationId");
};

const findByUserId = (userId: string) => {
  return Feedback.find({ userId })
    .populate("userId")
    .populate("visaApplicationId");
};

const findByVisaApplicationId = (visaApplicationId: string) => {
  return Feedback.find({ visaApplicationId })
    .populate("userId")
    .populate("visaApplicationId");
};

const deleteFeedback = async (id: string) => {
  return await Feedback.findByIdAndDelete(id);
};

export const feedbackRepository = {
  createFeedback,
  findAll,
  findByUserId,
  findByVisaApplicationId,
  deleteFeedback,
};