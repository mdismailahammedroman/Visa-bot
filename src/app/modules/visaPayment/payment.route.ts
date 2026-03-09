import express from "express";
import { visaPaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/pay/:id",
  checkAuth(Role.USER),
  visaPaymentController.payVisaApplication,
);

router.post("/cancel", visaPaymentController.cancelPaymentIntent);

router.post("/refund", visaPaymentController.refundPaymentIntent);

router.get(
  "/retrieve/:paymentIntentId",
  visaPaymentController.retrievePaymentIntentController,
);

router.post("/webhook", visaPaymentController.stripeWebhookHandler);

router.get(
  "/my-payments",
  checkAuth(Role.USER),
  visaPaymentController.myPaymentHistory,
);

router.get(
  "/admin/payments",
  checkAuth(Role.ADMIN),
  visaPaymentController.allPayments,
);

export const visaPaymentRouter = router;
