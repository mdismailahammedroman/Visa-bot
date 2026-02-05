/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import {
  IUser,
  TCreateUserPayload,
  TUpdateUserProfile,
  UserStatus,
} from "./user.interface";
import { userRepository } from "./user.repository";
import { hashPassword } from "../../helpers/passwordHelper";
import { otpService } from "../Otp/otp.service";
import { QueryParams } from "../../utils/queryBuilder";

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
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if user is verified
  if (!user.is_verified) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not verified");
  }

  // Check if user status is ACTIVE
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not active");
  }
  const updatedUser = await userRepository.updateUser(userId, update);

  return updatedUser;
};

const getByMySelf = async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not Found");
  }
  // Check if user is verified
  if (!user.is_verified) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not verified");
  }

  // Check if user status is ACTIVE
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not active");
  }

  user.password = undefined as any;

  return user;
};

const getAllUsersForAdmin = async (
  queryParams: QueryParams,
): Promise<IUser[]> => {
  const users = await userRepository.getAllUsersWithQuery(queryParams);
  return users;
};

export const userService = {
  registerUser,
  updateUser,
  getByMySelf,
  getAllUsersForAdmin,
};
