import bcrypt from "bcrypt";
import AppError from "../../ErrorHelpers/AppError";
import { otpRepository } from "./otp.repository";
import { generateOTP } from "../../helpers/otpHelper";
import { OtpPurpose, OtpRecord, VerifyOtpPayload } from "./otp.interface";
import { sendOtpEmail } from "../../utils/mail/mailer";
import { userRepository } from "../user/user.repository";
import { UserStatus } from "../user/user.interface";

const OTP_TTL_SEC = 2 * 60;
const MAX_ATTEMPTS = 5;
const BCRYPT_SALT_ROUNDS = 10;

const hashOtp = (otp: string) => bcrypt.hashSync(otp, BCRYPT_SALT_ROUNDS);
const verifyOtpHash = (otp: string, hash: string) =>
  bcrypt.compareSync(otp, hash);

export const sendOtp = async (
  email: string,
  purpose: OtpPurpose,
  name?: string,
) => {
  const lowerEmail = email.toLowerCase();

  if (purpose === "NEW_USER_VERIFY" || purpose === "VERIFY_EMAIL") {
    const user = await userRepository.findByEmail(lowerEmail);
    if (!user) throw new AppError(404, "User not found");

    if (user.is_verified && user.status === UserStatus.ACTIVE) {
      // Already verified, no need to send OTP
      throw new AppError(400, "User already verified");
    }
  }
  const otp = generateOTP();
  const now = Date.now();

  const record: OtpRecord = {
    email: lowerEmail,
    purpose,
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
    purpose,
  });

  return { email: lowerEmail, purpose, expiresInSec: OTP_TTL_SEC };
};

export const verifyOTP = async ({ email, otp, purpose }: VerifyOtpPayload) => {
  const lowerEmail = email.toLowerCase();

  // 1️⃣ Fetch OTP from Redis
  const record = await otpRepository.getOtpRecord(lowerEmail, purpose);
  if (!record) {
    throw new AppError(400, "OTP expired or not found");
  }

  // 2️⃣ Check expiration
  if (Date.now() > record.expiresAt) {
    await otpRepository.deleteOtpRecord(lowerEmail, purpose);
    throw new AppError(400, "OTP expired");
  }

  // 3️⃣ Check max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    await otpRepository.deleteOtpRecord(lowerEmail, purpose);
    throw new AppError(429, "Too many attempts");
  }

  // 4️⃣ Validate OTP
  if (!verifyOtpHash(otp, record.otpHash)) {
    record.attempts += 1;

    const ttlSec = Math.max(
      1,
      Math.floor((record.expiresAt - Date.now()) / 1000),
    );

    await otpRepository.setOtpRecord(record, ttlSec);
    throw new AppError(400, "Invalid OTP");
  }

  // 5️⃣ OTP is valid — remove it
  await otpRepository.deleteOtpRecord(lowerEmail, purpose);

  // 6️⃣ Purpose-specific actions
  switch (purpose) {
    case "NEW_USER_VERIFY":
    case "VERIFY_EMAIL": {
      const updatedUser = await userRepository.updateUserByEmail(lowerEmail, {
        is_verified: true,
        status: UserStatus.ACTIVE,
      });

      if (!updatedUser) {
        throw new AppError(404, "User not found");
      }

      return updatedUser;
    }

    case "FORGOT_PASSWORD": {
      const user = await userRepository.findByEmail(lowerEmail);
      if (!user) {
        throw new AppError(404, "User not found");
      }

      // OTP verified successfully, allow password reset
      return {
        success: true,
        message: "OTP verified for password reset",
      };
    }

    default:
      throw new AppError(400, "Invalid OTP purpose");
  }
};

export const otpService = {
  sendOtp,
  verifyOTP,
};
