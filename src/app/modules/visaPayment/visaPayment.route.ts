import { visaPaymentController } from "./visaPayment.controller";
import express from "express";

const router = express.Router();

// Cancel Payment
router.post("/cancel", visaPaymentController.cancelPaymentIntent);

// Refund Payment
router.post("/refund", visaPaymentController.refundPaymentIntent);

// Retrieve Payment
router.get(
  "/retrieve/:paymentIntentId",
  visaPaymentController.retrievePaymentIntentController,
);

export const visaPaymentRouter = router;
