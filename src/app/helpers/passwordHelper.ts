import bcrypt from "bcrypt";
import { envVar } from "../config/EnvVar";

export const hashPassword = (password: string) =>
  bcrypt.hash(password, parseInt(envVar.BCRYPT_SALT_ROUND));

export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
