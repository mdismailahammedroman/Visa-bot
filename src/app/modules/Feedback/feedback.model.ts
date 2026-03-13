// models/feedback.model.ts

import { Schema, model, Types } from "mongoose";
import { IFeedback } from "./feedback.interface";

const feedbackSchema = new Schema<IFeedback>({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  visaApplicationId: {
    type: Types.ObjectId,
    ref: "VisaApplication",
    required: true,
  },
  title: { type: String },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
