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
  if (!email) return null as any; // or throw error
  return User.findOne({ email: email.toLowerCase() }).exec();
};

const findByEmailWithPassword = (email: string) => {
  return User.findOne({ email: email.toLowerCase() })
    .select("+password")
    .exec();
};

const findById = (id: string) => {
  return User.findById(id).exec();
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
  ).exec();
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
  ).exec();
};
// updateUserById
const updateUser = (userId: string, update: Partial<TUpdateUserProfile>) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true, runValidators: true },
  ).exec();
};

const invalidateToken = async (userId: string) => {
  return await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const getAllUsersWithQuery = (params: QueryParams) => {
  const query = new QueryBuilder(User.find(), params)
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .build();

  return query.exec();
};

// export  userRepository

export const userRepository = {
  findByEmail,
  findByEmailWithPassword,
  findById,
  register,
  updatePasswordByEmail,
  updateStatusByEmail,
  verifyOtpByEmail,
  updateUser,
  invalidateToken,
  getAllUsersWithQuery,
};
