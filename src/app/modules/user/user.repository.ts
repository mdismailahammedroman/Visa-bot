import { TCreateUserPayload, UserStatus } from "./user.interface";
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

export const userRepository = {
  findByEmail,
  findByEmailWithPassword,
  findById,
  register,
  updateStatusByEmail,
};
