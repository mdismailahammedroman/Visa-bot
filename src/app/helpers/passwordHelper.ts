import bcrypt from "bcrypt";
import { envVar } from "../config/EnvVar";

export const hashPassword = (password: string) => {
  if (!password) throw new Error("Password is required for hashing");
  return bcrypt.hash(password, parseInt(envVar.BCRYPT_SALT_ROUND));
};

export const comparePassword = async (plain: string, hash: string) => {
  if (!plain || !hash) {
    // Throw a more descriptive error or return false
    console.error("comparePassword called with invalid arguments", {
      plain,
      hash,
    });
    return false; // safer than letting bcrypt throw
  }

  return bcrypt.compare(plain, hash);
};
