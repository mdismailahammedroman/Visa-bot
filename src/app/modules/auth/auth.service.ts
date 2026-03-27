/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import { userRepository } from "../user/user.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import { otpService } from "../Otp/otp.service";

/**
 * STEP 1: Forgot Password (Send OTP)
 */
const forgotPassword = async (email: string) => {
  const user = await userRepository.findByEmail(email);

  if (!user)
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");

  if (!user.is_verified)
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified");

  if (user.isDeleted)
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");

  // 🚨 prevent OTP spam (1 min cooldown)
  const otpCooldown = await redisClient.get(`forgot-password:${email}`);
  if (otpCooldown) {
    throw new AppError(
      StatusCodes.TOO_MANY_REQUESTS,
      "OTP already sent. Try again later"
    );
  }

  await redisClient.set(`forgot-password:${email}`, "true", { EX: 60 });

  await otpService.sendOtp(email, "FORGOT_PASSWORD", user.name);

  return { message: "OTP sent successfully" };
};

/**
 * STEP 2: Verify OTP
 */
const verifyOTPForPassword = async (email: string, otp: string) => {
  const user = await userRepository.findByEmail(email);

  if (!user)
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found");

  await otpService.verifyOTP({
    email,
    otp,
    purpose: "FORGOT_PASSWORD",
  });

  // mark OTP verified for 5 min
  await redisClient.set(`otp-verified:${email}`, "true", { EX: 300 });

  return { message: "OTP verified successfully" };
};

/**
 * STEP 3: Reset Password
 */
const resetPassword = async (email: string, newPassword: string) => {
  const isOtpVerified = await redisClient.get(`otp-verified:${email}`);

  if (!isOtpVerified) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "OTP not verified"
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await userRepository.updatePasswordByEmail(
    email,
    hashedPassword
  );

  // cleanup redis
  await redisClient.del(`otp-verified:${email}`);
  await redisClient.del(`forgot-password:${email}`);

  return {
    message: "Password reset successfully",
    user,
  };
};

/**
 * STEP 4: Change Password (logged in user)
 */
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await userRepository.findByIdWithPassword(userId);

  if (!user)
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password || "");

  if (!isMatch)
    throw new AppError(StatusCodes.BAD_REQUEST, "Old password incorrect");

  // prevent same password reuse
  const isSame = await bcrypt.compare(newPassword, user.password || "");
  if (isSame) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "New password cannot be same as old password"
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password changed successfully" };
};

/**
 * STEP 5: Logout (JWT blacklist system)
 */
const logout = async (token: string, userId: string) => {
  // blacklist token
  await redisClient.set(`blacklist:${token}`, "true", {
    EX: 60 * 60 * 24, // 1 day
  });

await userRepository.updateUser(userId, {
  lastLogoutAt: new Date(),
} as any)

  return { message: "Logged out successfully" };
};

/**
 * STEP 6: Update last login
 */
const updateLastLogin = async (userId: string) => {
  await userRepository.updateUser(userId, {
    lastLoginAt: new Date(),
  });
};

export const authService = {
  forgotPassword,
  verifyOTPForPassword,
  resetPassword,
  changePassword,
  logout,
  updateLastLogin,
};