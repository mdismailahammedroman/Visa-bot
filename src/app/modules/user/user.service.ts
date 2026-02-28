/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import {
  IUser,
  Role,
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
  return newUser;
};

const updateUser = async (
  userId: string,
  update: Partial<TUpdateUserProfile>,
  file?: Express.MulterS3.File,
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

  // If file uploaded, update profile picture URL



  if (file) {
    update.profile_picture = file.location; // S3 public URL
  }
  if (file) {
    update.coverPicture = file.location; // S3 public URL
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
): Promise<{ data: IUser[]; meta: any }> => {
  const usersWithMeta = await userRepository.getAllUsersWithQuery(queryParams);
  return {
    data: usersWithMeta.data,
    meta: usersWithMeta.meta,
  };
};

const getUserProfileForAdmin = async (userId: string) => {
  const user = await userRepository.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    mobile: user.mobile,
    location: user.location,

    profile_picture: user.profile_picture,
    coverPicture: user.coverPicture,

    status: user.status,
    role: user.role,


    memberSince: user.createdAt,
    lastLogin: user.lastLoginAt,

    accountActions: {
      canResetPassword: true,
      canDeleteAccount: true,
      canBlockUser: true,
    },
  };
};

const changeUserStatus = async (
  adminUser: IUser,
  userId: string,
  status: UserStatus,
) => {
  // Only admins can change status
  if (![Role.MAIN_MANAGER, Role.ADMIN].includes(adminUser.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only admins can change user status",
    );
  }

  const user = await userRepository.findById(userId);
  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const updatedUser = await userRepository.updateUser(userId, { status });
  return updatedUser;
};

const changeUserRole = async (adminUser: IUser, userId: string, role: Role) => {
  // Only admins can change role
  if (![Role.ADMIN].includes(adminUser.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only admins can change user role",
    );
  }

  const user = await userRepository.findById(userId);
  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const updatedUser = await userRepository.updateUser(userId, { role });
  return updatedUser;
};

const deleteMyAccount = async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  await userRepository.deleteUserById(userId); // repository handles hard delete
  return null;
};

// export user services
export const userService = {
  registerUser,
  updateUser,
  getByMySelf,
  getAllUsersForAdmin,
  getUserProfileForAdmin,
  changeUserStatus,
  changeUserRole,
  deleteMyAccount,
};
