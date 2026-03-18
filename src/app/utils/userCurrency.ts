import { userRepository } from "../modules/user/user.repository";

export const getUserCurrency = async (userId: string) => {
  const user = await userRepository.findById(userId);
  return user?.currency || "USD";
};