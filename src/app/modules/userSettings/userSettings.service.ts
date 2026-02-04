import { userSettingsRepository } from "./userSettings.repository";
import { TUpdateUserSettingsPayload } from "./userSettings.interface";
import { JwtPayload } from "jsonwebtoken";

const getMySettings = async (userId: JwtPayload) => {
  let settings = await userSettingsRepository.findByUserId(userId);

  // auto create settings on first time
  if (!settings) {
    settings = await userSettingsRepository.createDefaultByUserId(userId);
  }

  return settings;
};

const updateMySettings = async (
  userId: JwtPayload,
  payload: TUpdateUserSettingsPayload,
) => {
  return userSettingsRepository.upsertByUserId(userId, payload);
};

export const userSettingsService = {
  getMySettings,
  updateMySettings,
};
