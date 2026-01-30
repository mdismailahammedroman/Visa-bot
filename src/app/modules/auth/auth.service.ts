import { userRepository } from "../user/user.repository";
import AppError from "../../ErrorHelpers/AppError";
import { otpService } from "../Otp/otp.service";

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
  const data = await otpService.sendOtp(email, user.name);

  // 5️⃣ Return response
  return {
    message: "OTP sent for password reset",
    data,
  };
};

export const authService = {
  forgotPassword,
};
