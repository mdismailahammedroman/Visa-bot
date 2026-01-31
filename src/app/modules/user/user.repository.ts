import { hashPassword } from "../../helpers/passwordHelper";
import { IUser, TCreateUserPayload, UserStatus } from "./user.interface";
import { User } from "./user.model";

const findByEmail = (email: string) => {
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

const updateUserByEmail = (email: string, update: Partial<IUser>) => {
  return User.findOneAndUpdate({ email: email.toLowerCase() }, update, {
    new: true,
  }).exec();
};

export const userRepository = {
  findByEmail,
  findByEmailWithPassword,
  findById,
  register,
  updatePasswordByEmail,
  updateStatusByEmail,
  updateUserByEmail,
};
