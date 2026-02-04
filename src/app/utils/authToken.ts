import { JwtPayload } from "./../types/auth.types";
import { IUser, Role } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "../helpers/jwtHelper";
import { envVar } from "../config/EnvVar";
import AppError from "../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

export const createUserTokens = async (user: IUser) => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role as Role,
    email: user.email,
  };

  const accessToken = generateToken(
    payload,
    envVar.JWT_SECRET,
    envVar.JWT_EXPIRES_IN,
  );

  const refreshToken = generateToken(
    payload,
    envVar.JWT_REFRESH_SECRET,
    envVar.JWT_REFRESH_EXPIRATION_DAYS,
  );

  return { accessToken, refreshToken };
};

export const refreshUserToken = async (refreshToken: string) => {
  const payload = verifyToken(
    refreshToken,
    envVar.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  if (!payload?.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh Token!");
  }

  return generateToken(
    { userId: payload.userId, role: payload.role, email: payload.email },
    envVar.JWT_SECRET,
    envVar.JWT_EXPIRES_IN,
  );
};
