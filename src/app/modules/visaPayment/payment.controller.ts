/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { visaPaymentService } from "./payment.service";
import { stripe } from "../../config/stripe";
import { envVar } from "../../config/EnvVar";

const payVisaApplication = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await visaPaymentService.payVisaApplication(
    req.params.id as string,
    user._id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment intent created",
    data: result,
  });
});

const stripeWebhookHandler = CatchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    envVar.STRIPE.STRIPE_WEBHOOK_SECRET
  );

  const result = await visaPaymentService.StripeWebhookService(event);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Webhook received",
    data: result,
  });
});

const cancelPaymentIntent = CatchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  const result = await visaPaymentService.cancelPayment(paymentIntentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment canceled",
    data: result,
  });
});

const refundPaymentIntent = CatchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  const result = await visaPaymentService.refundPayment(paymentIntentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment refunded",
    data: result,
  });
});

const retrievePaymentIntentController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await visaPaymentService.retrievePaymentIntent(
      req.params.paymentIntentId as string
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment retrieved",
      data: result,
    });
  }
);


const myPaymentHistory = CatchAsync(async (req: Request, res: Response) => {

  const user = req.user as any;

  const result = await visaPaymentService.getMyPaymentHistory(user._id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My payment history retrieved successfully",
    data: result,
  });
});


const allPayments = CatchAsync(async (req: Request, res: Response) => {

  const result = await visaPaymentService.getAllPayments();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All payments retrieved successfully",
    data: result,
  });
});

export const visaPaymentController = {
  payVisaApplication,
  stripeWebhookHandler,
  cancelPaymentIntent,
  refundPaymentIntent,
  retrievePaymentIntentController,
    myPaymentHistory,
  allPayments,
};