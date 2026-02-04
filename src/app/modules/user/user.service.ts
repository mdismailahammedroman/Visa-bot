import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { TCreateUserPayload, TUpdateUserProfile } from "./user.interface";
import { userRepository } from "./user.repository";
import { hashPassword } from "../../helpers/passwordHelper";
import { otpService } from "../Otp/otp.service";

const registerUser = async (payload: TCreateUserPayload) => {
  const existingUser = await userRepository.findByEmail(payload.email);
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "Email already in use");
  }

  const passwordHash = await hashPassword(payload.password);

  const newUser = await userRepository.register({
    ...payload,
    password: passwordHash,
  });
  await otpService.sendOtp(newUser.email, "NEW_USER_VERIFY", newUser.name);
  return newUser; // remove password before sending
};

const updateUser = async (
  userId: string,
  update: Partial<TUpdateUserProfile>,
) => {
  const updatedUser = await userRepository.updateUserById(userId, update);

  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

export const userService = { registerUser, updateUser };
