import { Types } from "mongoose";

export interface IUserSettings {
  _id: Types.ObjectId;

  user: Types.ObjectId; // ref User

  language: string;
  notifications_enabled: boolean;
  app_notifications: boolean;
  email_notifications: boolean;
  dark_mode: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type TUpdateUserSettingsPayload = Partial<
  Pick<
    IUserSettings,
    | "language"
    | "notifications_enabled"
    | "app_notifications"
    | "email_notifications"
    | "dark_mode"
  >
>;
