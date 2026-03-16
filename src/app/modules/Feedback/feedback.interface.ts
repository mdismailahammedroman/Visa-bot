import { Types } from "mongoose";

export interface IFeedback {
  userId: Types.ObjectId;  // The user who gave the feedback
  // visaApplicationId: Types.ObjectId;  // The visa application related to the feedback
  title:string;
  comments?: string;  // Optional feedback comments
  createdAt: Date;  // Timestamp of feedback submission
}