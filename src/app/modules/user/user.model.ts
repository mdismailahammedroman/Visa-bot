import { Schema, model } from "mongoose";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerID: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  },
);

// User Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // password hide by default
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },

    profile_picture: {
      type: String,
      default: "",
    },

    coverPicture: {
      type: String,
      default: "",
    },

    auth_providers: {
      type: [authProviderSchema],
      default: [],
    },

    fcmTokens: {
      type: [String],
      default: [],
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  },
);
export const User = model<IUser>("User", userSchema);
