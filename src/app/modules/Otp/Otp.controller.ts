// src/app/modules/otp/otp.controller.ts
import { Request, Response } from "express";
import AppError from "../../ErrorHelpers/AppError";
import { CatchAsync } from "../../utils/CatchAsync";
import { otpService } from "./otp.service";

// ======================================================================================
//  send OTP
// ======================================================================================
const sendOtp = CatchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body as {
    email?: string;
    name?: string;
  };

  if (!email) throw new AppError(400, "email required");

  const data = await otpService.sendOtp(email, name);

  res.status(200).json({
    success: true,
    message: "OTP sent",
    data,
  });
});

// ======================================================================================
//  * Resend OTP
// ======================================================================================
const resendOtp = CatchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body as {
    email?: string;
    name?: string;
  };

  if (!email) throw new AppError(400, "email  required");

  const data = await otpService.sendOtp(email, name);

  res.status(200).json({
    success: true,
    message: "OTP resent",
    data,
  });
});

// ======================================================================================
//  * verify OTP
// ======================================================================================
const verifyOTP = CatchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body as {
    email?: string;
    otp?: string;
  };

  if (!email || !otp) throw new AppError(400, "email, otp,  required");

  await otpService.verifyOTP({ email, otp });

  res.status(200).json({
    success: true,
    message: "OTP verified",
  });
});

export const otpController = {
  sendOtp,
  resendOtp,
  verifyOTP,
};
