/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisaApplicationPaymentModel } from "./payment.model";

const createPayment = (payload: any) => {
  return VisaApplicationPaymentModel.create(payload);
};

const updatePaymentStatus = (paymentIntentId: string, payload: any) => {
  return VisaApplicationPaymentModel.findOneAndUpdate(
    { paymentIntentId },
    payload,
    { new: true }
  );
};

const getMyPayments = (userId: string) => {
  return VisaApplicationPaymentModel.find({ userId })
    .populate("applicationId")
    .sort({ createdAt: -1 });
};

const getAllPayments = () => {
  return VisaApplicationPaymentModel.find()
    .populate("userId")
    .populate("applicationId")
    .sort({ createdAt: -1 });
};

export const PaymentRepository = {
  createPayment,
  updatePaymentStatus,
  getMyPayments,
  getAllPayments,
};