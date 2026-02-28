import { Query, Schema, model } from "mongoose";
import {
  GENDER_TYPE,
  IAuthProvider,
  IUser,

  Role,
  UserStatus,

} from "./user.interface";

/* ---------------- Auth Provider Sub Schema ---------------- */
const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
      enum: ["google", "credential"],
    },
    providerID: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

/* ---------------- User Schema ---------------- */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    gender: { type: String, enum: Object.values(GENDER_TYPE), default: null },
    profile_picture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    mobile: { type: String, default: "" },
    location: { type: String, default: "" },


    coordinate: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      placeName: { type: String },
    },
    lastLoginAt: { type: Date, default: null },
    auth_providers: { type: [authProviderSchema], default: [] },
    fcmTokens: { type: [String], default: [] },
    is_verified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

/* ---------------- Indexes ---------------- */
userSchema.index({ status: 1, role: 1, isDeleted: 1 });
/* ---------------- Soft Delete Middleware ---------------- */
userSchema.pre(/^find/, function (this: Query<IUser, IUser>) {
  this.where({ isDeleted: false }); // soft delete
});

/* ---------------- Export Model ---------------- */
export const User = model<IUser>("User", userSchema);
