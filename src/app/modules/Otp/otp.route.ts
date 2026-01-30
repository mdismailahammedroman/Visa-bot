// src/app/modules/otp/otp.route.ts
import { Router } from "express";
import { otpController } from "./Otp.controller";

const router = Router();

router.post("/send", otpController.sendOtp);
router.post("/verify", otpController.verifyOTP);
router.post("/resend", otpController.resendOtp);

export const otpRouter = router;
