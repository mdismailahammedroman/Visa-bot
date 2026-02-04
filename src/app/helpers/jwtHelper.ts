import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expired: string,
) => {
  return jwt.sign(payload, secret, { expiresIn: expired } as SignOptions);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as JwtPayload;
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
