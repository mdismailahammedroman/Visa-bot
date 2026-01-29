import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { TCreateUserPayload } from "./user.interface";
import { userRepository } from "./user.repository";
import { hashPassword } from "../../helpers/passwordHelper";

const registerUser = async (payload: TCreateUserPayload) => {
  const existingUser = await userRepository.findByEmail(payload.email);
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "Email already in use");
  }

  const passwordHash = await hashPassword(payload.password);

  const newUser = await userRepository.register({
    ...payload,
    password: passwordHash,
  });

  return newUser; // remove password before sending
};

export const userService = { registerUser };
