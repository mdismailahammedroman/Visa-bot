import bcrypt from "bcrypt";
import AppError from "../../ErrorHelpers/AppError";
import { otpRepository } from "./otp.repository";
import { generateOTP } from "../../helpers/otpHelper";
import { OtpRecord, VerifyOtpPayload } from "./otp.interface";
import { sendOtpEmail } from "../../utils/mail/mailer";

const OTP_TTL_SEC = 5 * 60; // 5 minutes
const MAX_ATTEMPTS = 5;
const BCRYPT_SALT_ROUNDS = 10;

// Hash OTP
const hashOtp = (otp: string): string =>
  bcrypt.hashSync(otp, BCRYPT_SALT_ROUNDS);

// Verify OTP hash
const verifyOtpHash = (otp: string, hash: string): boolean =>
  bcrypt.compareSync(otp, hash);

/**
 * Send OTP
 */
const sendOtp = async (email: string, name?: string) => {
  const lowerEmail = email.toLowerCase();
  const otp = generateOTP();
  const now = Date.now();

  const record: OtpRecord = {
    email: lowerEmail,
    otpHash: hashOtp(otp),
    expiresAt: now + OTP_TTL_SEC * 1000,
    attempts: 0,
    lastSentAt: now,
  };

  await otpRepository.setOtpRecord(record, OTP_TTL_SEC);

  await sendOtpEmail({
    to: lowerEmail,
    name: name || lowerEmail,
    otp,
    expiry: OTP_TTL_SEC / 60,
  });

  return { email: record.email, expiresInSec: OTP_TTL_SEC };
};

const verifyOTP = async ({ email, otp }: VerifyOtpPayload) => {
  const lowerEmail = email.toLowerCase();
  const record = await otpRepository.getOtpRecord(lowerEmail);
  if (!record) throw new AppError(400, "OTP expired or not found");

  if (Date.now() > record.expiresAt) {
    await otpRepository.deleteOtpRecord(lowerEmail);
    throw new AppError(400, "OTP expired");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await otpRepository.deleteOtpRecord(lowerEmail);
    throw new AppError(429, "Too many attempts. Request new OTP.");
  }

  const ok = verifyOtpHash(otp, record.otpHash);
  if (!ok) {
    record.attempts += 1;
    const ttlSec = Math.max(
      1,
      Math.floor((record.expiresAt - Date.now()) / 1000),
    );
    await otpRepository.setOtpRecord(record, ttlSec);
    throw new AppError(400, "Invalid OTP");
  }

  await otpRepository.deleteOtpRecord(lowerEmail);
  return true;
};

export const otpService = {
  sendOtp,
  verifyOTP,
};
