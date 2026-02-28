import Stripe from "stripe";
import { stripe } from "../../config/stripe";
import { VisaApplicationRepository } from "../visaApply/visa.repository";
import { ApplicationStatus, PaymentStatus } from "../visaApply/visa.interface";

// Webhook handler
const StripeWebhookService = async (event: Stripe.Event) => {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const applicationId = paymentIntent.metadata.applicationId;

    const updated = await VisaApplicationRepository.updateById(applicationId as string, {
      paymentStatus: PaymentStatus.PAID,
      status: ApplicationStatus.PROCESSING,
    });

    return updated;
  }

  return { message: `Event ${event.type} ignored` };
};

// Cancel PaymentIntent
const cancelPayment = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.cancel(paymentIntentId);
};

// Refund PaymentIntent
const refundPayment = async (paymentIntentId: string) => {
  return await stripe.refunds.create({ payment_intent: paymentIntentId });
};

// Retrieve PaymentIntent
const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

export const visaPaymentService = {
  StripeWebhookService,
  cancelPayment,
  refundPayment,
  retrievePaymentIntent,
};