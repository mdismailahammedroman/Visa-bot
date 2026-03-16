import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../ErrorHelpers/AppError";
import { verifyToken } from "../helpers/jwtHelper";
import { envVar } from "../config/EnvVar";
import { User } from "../modules/user/user.model";
import { UserStatus } from "../modules/user/user.interface";

interface AuthJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const checkAuth =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Access token not provided",
        );
      }

      // ✅ Verify token
      const decoded = verifyToken(token, envVar.JWT_SECRET) as AuthJwtPayload;

      if (!decoded?.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }

      // ✅ Fetch full user from DB
      const user = await User.findById(decoded.userId).lean();
      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
      }

      // ✅ Status check
      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.PENDING
      ) {
        throw new AppError(httpStatus.FORBIDDEN, `User is ${user.status}`);
      }

      // ✅ Deleted check
      if (user.isDeleted) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "User account has been deleted",
        );
      }

      // ✅ Role-based authorization
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not authorized to access this route",
        );
      }

      // ✅ Attach full user object to request
      req.user = user; // ✅ full user, name included

      next();
    } catch (error) {
      next(error);
    }
  };
