import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expired: string,
): string => {
  const token = jwt.sign(payload, secret, {
    expiredIn: expired,
  } as SignOptions);
  return token;
};
export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | string => {
  return jwt.verify(token, secret) as JwtPayload | string;
};

export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};
