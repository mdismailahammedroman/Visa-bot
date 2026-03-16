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

router.post("/cancel",   checkAuth(Role.USER, Role.ADMIN), visaPaymentController.cancelPaymentIntent);

router.post("/refund",   checkAuth(Role.ADMIN),
visaPaymentController.refundPaymentIntent);

router.get(
  "/retrieve/:paymentIntentId",
    checkAuth(Role.USER, Role.ADMIN),

  visaPaymentController.retrievePaymentIntentController,
);


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
