/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisaApplicationModel } from "../../visaApply/visa.model";
import { VisaApplicationPaymentModel } from "../../visaPayment/payment.model";

export const getUserAIContext = async (userId: string) => {

  const applications = await VisaApplicationModel.find({ userId })
    .populate("countryId visaServiceId");

  const payments = await VisaApplicationPaymentModel.find({ userId })
    .populate("applicationId");

  const appSummary =
    applications
      .map((app: any) => {
        const country = app.countryId?.countryName || "Unknown";
        const service = app.visaServiceId?.serviceName || "Unknown";

        return `TrackingId: ${app.trackingId}, Country: ${country}, Service: ${service}, Status: ${app.status}, Fee: ${app.totalFee}`;
      })
      .join("\n") || "No visa applications found.";

  const paymentSummary =
    payments
      .map((p: any) => {
        const service =
          p.applicationId?.visaServiceId?.serviceName || "Unknown";

        return `PaymentId: ${p.paymentIntentId}, Amount: ${p.amount} ${p.currency}, Status: ${p.status}, Service: ${service}`;
      })
      .join("\n") || "No payment history found.";

  return {
    applications: appSummary,
    payments: paymentSummary,
  };
};