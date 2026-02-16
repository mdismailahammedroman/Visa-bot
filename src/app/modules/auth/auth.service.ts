import bcrypt from "bcrypt";
import { userRepository } from "../user/user.repository";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import { otpService } from "../Otp/otp.service";

// Step 1: Send OTP for forgot password
const forgotPassword = async (email: string) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  if (!user.is_verified)
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified");
  if (user.isDeleted)
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");

  // Send OTP using otpService
  await otpService.sendOtp(email, "FORGOT_PASSWORD", user.name);

  return { message: "OTP sent successfully" };
};

// Step 2: Verify OTP
const verifyOTPForPassword = async (email: string, otp: string) => {
  await otpService.verifyOTP({
    email,
    otp,
    purpose: "FORGOT_PASSWORD", // ✅ hardcoded
  });

  await redisClient.set(`otp-verified:${email}`, "true", { EX: 300 });

  return { message: "OTP verified successfully" };
};

// Step 3: Reset password after OTP verified
const resetPassword = async (email: string, newPassword: string) => {
  const isOtpVerified = await redisClient.get(`otp-verified:${email}`);
  if (!isOtpVerified)
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "OTP not verified. Please verify OTP first",
    );

  const user = await userRepository.updatePasswordByEmail(email, newPassword);

  await redisClient.del(`otp-verified:${email}`);

  return { message: "Password reset successfully", user };
};

// Step 4: Change password (logged-in user)
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await userRepository.findByIdWithPassword(userId); // now returns a doc
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password || "");
  if (!isMatch)
    throw new AppError(StatusCodes.BAD_REQUEST, "Old password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: "Password changed successfully" };
};

// Logout user
const logout = async (userId: string) => {
  await userRepository.invalidateToken(userId);
};

// Update last login
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
