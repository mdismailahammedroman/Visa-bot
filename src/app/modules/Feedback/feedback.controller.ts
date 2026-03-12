/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
;
import { feedbackService } from "./feedback.service";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";

const submitFeedback = CatchAsync(async (req: Request, res: Response) => {

    const user = req.user as any;
    const userId = user._id

  // Merge userId with body
  const payload = {
    ...req.body,
    userId,
  };
  const result = await feedbackService.createFeedback(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Feedback submitted successfully",
    data: result,
  });
});

const getMyFeedback = CatchAsync(async (req: any, res: Response) => {
  // ✅ Ensure req.user.id is coming from checkAuth
    const user = req.user as any;
    const userId = user._id
console.log("Logged in user:", req.user);
  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "User not authenticated",
    });
  }

  // Get feedback from service
  const result = await feedbackService.getUserFeedback(userId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My feedback retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAllFeedback = CatchAsync(async (req: Request, res: Response) => {
  const result = await feedbackService.getAllFeedback(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All feedback retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getFeedbackByVisaApplication = CatchAsync(
  async (req: Request, res: Response) => {
    const { visaApplicationId } = req.params;

    const result =
      await feedbackService.getFeedbackByVisaApplication(visaApplicationId as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Visa application feedback retrieved successfully",
      data: result,
    });
  },
);

const deleteFeedback = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await feedbackService.deleteFeedback(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Feedback deleted successfully",
    data: result,
  });
});

export const feedbackController = {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackByVisaApplication,
  deleteFeedback,
};