/* eslint-disable @typescript-eslint/no-explicit-any */
import { hashPassword } from "../../helpers/passwordHelper";
import { QueryBuilder, QueryParams } from "../../utils/queryBuilder";
import {
  AuthProviderType,
  IUser,
  Role,
  TCreateUserPayload,
  TUpdateUserProfile,
  UserStatus,
} from "./user.interface";
import { User } from "./user.model";

/* ================= BASIC FINDS ================= */

const findByEmail = (email: string) => {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase().trim() }).lean().exec();
};

const findByEmailWithPassword = (email: string) => {
  return User.findOne({ email: email.toLowerCase().trim() })
    .select("+password")
    .exec();
};

const findById = (id: string) => User.findById(id).lean().exec();

const findByIdWithPassword = (id: string) =>
  User.findById(id).select("+password").exec();

const findByRole = (role: Role) => User.find({ role }).lean().exec();

/* ================= CREATE USERS ================= */

const register = (payload: TCreateUserPayload) => {
  return User.create({
    name: payload.name,
    email: payload.email.toLowerCase().trim(),
    password: payload.password,
    role: Role.USER,
  });
};

const createOAuthUser = (payload: Partial<IUser>) => {
  if (payload.email) {
    payload.email = payload.email.toLowerCase().trim();
  }
  return User.create(payload);
};

/* ================= PROVIDER ================= */

const findByProvider = (
  provider: AuthProviderType,
  providerID: string,
) => {
  return User.findOne({
    "auth_providers.provider": provider,
    "auth_providers.providerID": providerID,
  }).exec();
};

const addAuthProvider = (
  userId: string,
  provider: AuthProviderType,
  providerID: string,
) => {
  return User.updateOne(
    { _id: userId },
    {
      $addToSet: {
        auth_providers: { provider, providerID },
      },
    },
  ).exec();
};

/* ================= UPDATE ================= */

const updateUser = (
  userId: string,
  update: Partial<TUpdateUserProfile>,
) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true, runValidators: true },
  )
    .lean()
    .exec();
};

const updateStatusByEmail = (email: string, status: UserStatus) => {
  return User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { status },
    { new: true },
  )
    .lean()
    .exec();
};

const updatePasswordByEmail = async (
  email: string,
  newPassword: string,
) => {
  const hashedPassword = await hashPassword(newPassword);

  return User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { password: hashedPassword },
    { new: true },
  )
    .select("+password")
    .lean()
    .exec();
};

const verifyOtpByEmail = (
  email: string,
  update: Partial<IUser>,
) => {
  return User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { $set: update },
    { new: true, runValidators: true },
  )
    .lean()
    .exec();
};

const invalidateToken = (userId: string) => {
  return User.findByIdAndUpdate(userId, {
    refreshToken: null,
  })
    .lean()
    .exec();
};

const deleteUserById = (userId: string) => {
  return User.findByIdAndDelete(userId).lean().exec();
};

const addFCMToken = (userId: string, token: string) => {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { fcmTokens: token } },
    { new: true },
  )
    .lean()
    .exec();
};

/* ================= QUERY ================= */

const getAllUsersWithQuery = (params: QueryParams) => {
  return new QueryBuilder(User.find(), params)
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .build();
};

export const userRepository = {
  findByEmail,
  findByEmailWithPassword,
  findById,
  findByIdWithPassword,
  findByRole,
  register,
  createOAuthUser,
  findByProvider,
  addAuthProvider,
  updateUser,
  updateStatusByEmail,
  updatePasswordByEmail,
  verifyOtpByEmail,
  invalidateToken,
  getAllUsersWithQuery,
  deleteUserById,
  addFCMToken,
};