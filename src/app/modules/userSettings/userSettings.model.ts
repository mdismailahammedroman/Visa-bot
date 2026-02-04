import { Schema, model } from "mongoose";

const userSettingsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    language: { type: String, default: "en" },
    notifications_enabled: { type: Boolean, default: true },
    app_notifications: { type: Boolean, default: true },
    email_notifications: { type: Boolean, default: true },
    dark_mode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UserSettings = model("UserSettings", userSettingsSchema);
