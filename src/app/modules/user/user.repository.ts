/* eslint-disable @typescript-eslint/no-explicit-any */
import { hashPassword } from "../../helpers/passwordHelper";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import {
  IUser,
  TCreateUserPayload,
  TUpdateUserProfile,
  UserStatus,
} from "./user.interface";
import { User } from "./user.model";

const findByEmail = (email: string) => {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase() }).lean().exec();
};

const findByEmailWithPassword = (email: string) => {
  return User.findOne({ email: email.toLowerCase() })
    .select("+password")

    .exec();
};

const findById = (id: string) => {
  return User.findById(id).lean().exec();
};

const register = (payload: TCreateUserPayload) => {
  return User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
  });
};

const updateStatusByEmail = (email: string, status: UserStatus) => {
  return User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { status },
    { new: true },
  )
    .lean()
    .exec();
};

const updatePasswordByEmail = async (email: string, newPassword: string) => {
  // Hash the password
  const hashedPassword = await hashPassword(newPassword);

  // Update user
  const updatedUser = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { password: hashedPassword },
    { new: true }, // returns the updated document
  ).select("+password"); // include password if needed for verification

  return updatedUser;
};
// otp verify
const verifyOtpByEmail = (email: string, update: Partial<IUser>) => {
  return User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: update },
    { new: true, runValidators: true },
  )
    .lean()
    .exec();
};
// updateUserById
const updateUser = (userId: string, update: Partial<TUpdateUserProfile>) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true, runValidators: true },
  )
    .lean()
    .exec();
};

const invalidateToken = async (userId: string) => {
  return await User.findByIdAndUpdate(userId, { refreshToken: null })
    .lean()
    .exec();
};

const getAllUsersWithQuery = (params: QueryParams) => {
  return new QueryBuilder(User.find(), params)
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .build();
};

const deleteUserById = (userId: string) => {
  return User.findByIdAndDelete(userId).lean().exec(); // lean + fast
};

const findByIdWithPassword = (id: string) => {
  return User.findById(id).select("+password").exec();
};

// export  userRepository

export const userRepository = {
  findByEmail,
  findByEmailWithPassword,
  findByIdWithPassword,
  findById,
  register,
  updatePasswordByEmail,
  updateStatusByEmail,
  verifyOtpByEmail,
  updateUser,
  deleteUserById,
  invalidateToken,
  getAllUsersWithQuery,
};
