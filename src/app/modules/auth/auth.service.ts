import { userRepository } from "../user/user.repository";
import AppError from "../../ErrorHelpers/AppError";
import { otpService } from "../Otp/otp.service";
import { StatusCodes } from "http-status-codes";

const forgotPassword = async (email: string) => {
  // 1️⃣ Check if user exists
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError(404, "User not found");

  // 2️⃣ Check if email is verified
  if (!user.is_verified) {
    throw new AppError(400, "User email is not verified");
  }

  // 3️⃣ Check if user is deleted
  if (user.isDeleted) {
    throw new AppError(400, "This user account has been deleted");
  }

  // 4️⃣ Send OTP for forgot password
  const data = await otpService.sendOtp(email, "FORGOT_PASSWORD", user.name);

  // 5️⃣ Return response
  return {
    message: "OTP sent for password reset",
    data,
  };
};

const resetPassword = async (email: string, newPassword: string) => {
  // Check if user exists
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  // Update password — MUST await
  const updatedUser = await userRepository.updatePasswordByEmail(
    email,
    newPassword,
  );

  return updatedUser;
};

const logout = async (userId: string) => {
  await userRepository.invalidateToken(userId);
  return { message: "User logged out successfully" };
};

export const authService = {
  forgotPassword,
  resetPassword,
  logout,
};
