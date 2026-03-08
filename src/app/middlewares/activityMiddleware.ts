/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { ActivityLogService } from "../modules/activity/activityLog.service";

export const activityMiddleware = (action: string, entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
const user=req.user as any
    res.on("finish", async () => {

      if (!req.user) return;

      

      await ActivityLogService.logActivity({
        actorId: user._id,
        actorRole: user.role,
        action,
        entityType: entity,
        status: res.statusCode < 400 ? "SUCCESS" : "FAILED",
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });

    });

    next();
  };
};