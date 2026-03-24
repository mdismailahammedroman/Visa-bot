import Stripe from "stripe";
import { stripe } from "../../config/stripe";
import { VisaApplicationRepository } from "../visaApply/visa.repository";
import { PaymentRepository } from "./payment.repository";
import { PaymentStatus } from "./payment.interface";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { getUserCurrency } from "../../utils/userCurrency";
import { getCurrencyRate } from "../../utils/fixer";


const payVisaApplication = async (applicationId: string, userId: string) => {
  const application = await VisaApplicationRepository.findById(applicationId);

  if (!application)
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");

  if (application.userId.toString() !== userId.toString())
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized");

  if (!application.totalFee)
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid amount");

  const userCurrency = await getUserCurrency(userId);

  // 🔥 ONE RATE FETCH
  const rate = (await getCurrencyRate(userCurrency)) ?? 1;

  // 🔥 convert manually (same pattern as service)
  const convertedAmount =
    userCurrency === "USD"
      ? application.totalFee
      : application.totalFee * rate;

const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(convertedAmount * 100),
  currency: userCurrency.toLowerCase(),
  metadata: {
    applicationId: applicationId.toString(), // ✅ FIX
    userId: userId.toString(),               // ✅ FIX
  },
});

  await PaymentRepository.createPayment({
    applicationId,
    userId,
    paymentIntentId: paymentIntent.id,
    amount: Number(convertedAmount.toFixed(2)),
    currency: userCurrency,
    status: PaymentStatus.PENDING,
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

const StripeWebhookService = async (event: Stripe.Event) => {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await PaymentRepository.updatePaymentStatus(paymentIntent.id, {
      status: PaymentStatus.SUCCESS,
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await PaymentRepository.updatePaymentStatus(paymentIntent.id, {
      status: PaymentStatus.FAILED,
    });
  }

  return { received: true };
};

const cancelPayment = async (paymentIntentId: string) => {
  return stripe.paymentIntents.cancel(paymentIntentId);
};

const refundPayment = async (paymentIntentId: string) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });

  await PaymentRepository.updatePaymentStatus(paymentIntentId, {
    status: PaymentStatus.REFUNDED,
  });

  return refund;
};

const retrievePaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

const getMyPaymentHistory = async (userId: string) => {
  return PaymentRepository.getMyPayments(userId);
};

const getAllPayments = async () => {
  return PaymentRepository.getAllPayments();
};

export const visaPaymentService = {
  payVisaApplication,
  StripeWebhookService,
  cancelPayment,
  refundPayment,
  retrievePaymentIntent,
  getMyPaymentHistory,
  getAllPayments,
};
