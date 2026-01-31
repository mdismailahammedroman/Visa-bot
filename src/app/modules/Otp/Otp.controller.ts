import { Request, Response } from "express";
import AppError from "../../ErrorHelpers/AppError";
import { CatchAsync } from "../../utils/CatchAsync";
import { OtpPurpose } from "./otp.interface";
import { otpService } from "./otp.service";

const sendOtp = CatchAsync(async (req: Request, res: Response) => {
  const { email, name, purpose } = req.body as {
    email?: string;
    name?: string;
    purpose?: OtpPurpose;
  };

  if (!email) throw new AppError(400, "email required");
  if (!purpose) throw new AppError(400, "purpose required");

  const data = await otpService.sendOtp(email, purpose, name);

  res.status(200).json({ success: true, message: "OTP sent", data });
});

const resendOtp = CatchAsync(async (req: Request, res: Response) => {
  const { email, name, purpose } = req.body as {
    email?: string;
    name?: string;
    purpose?: OtpPurpose;
  };

  if (!email) throw new AppError(400, "email required");
  if (!purpose) throw new AppError(400, "purpose required");

  const data = await otpService.sendOtp(email, purpose, name);

  res.status(200).json({ success: true, message: "OTP resent", data });
});

const verifyOTP = CatchAsync(async (req: Request, res: Response) => {
  const { email, otp, purpose } = req.body as {
    email?: string;
    otp?: string;
    purpose?: OtpPurpose;
  };

  if (!email || !otp) throw new AppError(400, "email, otp required");
  if (!purpose) throw new AppError(400, "purpose required");

  await otpService.verifyOTP({ email, otp, purpose });

  res.status(200).json({ success: true, message: "OTP verified" });
});

export const otpController = { sendOtp, resendOtp, verifyOTP };
