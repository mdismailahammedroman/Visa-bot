/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVar } from "./../../config/EnvVar";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { visaPaymentService } from "./visaPayment.service";
import { stripe } from "../../config/stripe";

// Webhook handler
const stripeWebhookHandler = CatchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = envVar.STRIPE.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const result = await visaPaymentService.StripeWebhookService(event);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Webhook received successfully",
    data: result,
  });
});

// Cancel Payment
const cancelPaymentIntent = CatchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  const result = await visaPaymentService.cancelPayment(paymentIntentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "PaymentIntent canceled successfully",
    data: result,
  });
});

// Refund Payment
const refundPaymentIntent = CatchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  const result = await visaPaymentService.refundPayment(paymentIntentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "PaymentIntent refunded successfully",
    data: result,
  });
});

// Retrieve Payment
const retrievePaymentIntentController = CatchAsync(
  async (req: Request, res: Response) => {
    const { paymentIntentId } = req.params;

    const result = await visaPaymentService.retrievePaymentIntent(
      paymentIntentId as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "PaymentIntent retrieved successfully",
      data: result,
    });
  },
);

export const visaPaymentController = {
  stripeWebhookHandler,
  cancelPaymentIntent,
  refundPaymentIntent,
  retrievePaymentIntentController,
};
