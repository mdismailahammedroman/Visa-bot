/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { UserSettings } from "./userSettings.model";
import { TUpdateUserSettingsPayload } from "./userSettings.interface";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

type UserIdInput = string | Types.ObjectId | JwtPayload;

const toObjectId = (input: UserIdInput): Types.ObjectId => {
  // already ObjectId
  if (input instanceof Types.ObjectId) return input;

  // string id
  if (typeof input === "string") {
    if (!Types.ObjectId.isValid(input)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid userId");
    }
    return new Types.ObjectId(input);
  }

  // JwtPayload -> extract
  const raw = (input as any).userId || (input as any).id || (input as any)._id;

  if (!raw) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Invalid token payload: userId missing",
    );
  }

  const str = raw.toString();
  if (!Types.ObjectId.isValid(str)) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Invalid userId in token payload",
    );
  }

  return new Types.ObjectId(str);
};

const findByUserId = (userId: UserIdInput) => {
  const id = toObjectId(userId);
  return UserSettings.findOne({ user: id }).exec();
};

const createDefaultByUserId = (userId: UserIdInput) => {
  const id = toObjectId(userId);
  return UserSettings.create({ user: id }); // ✅ always ObjectId
};

const upsertByUserId = (
  userId: UserIdInput,
  payload: TUpdateUserSettingsPayload,
) => {
  const id = toObjectId(userId);

  return UserSettings.findOneAndUpdate(
    { user: id },
    { $set: payload },
    { new: true, upsert: true, runValidators: true },
  ).exec();
};

export const userSettingsRepository = {
  findByUserId,
  createDefaultByUserId,
  upsertByUserId,
};
