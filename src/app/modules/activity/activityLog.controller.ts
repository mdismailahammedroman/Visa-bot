import { Request, Response } from "express";
import { ActivityLogService } from "./activityLog.service";

const getActivityLogsController = async (req: Request, res: Response) => {
  const result = await ActivityLogService.getActivityLogs(req.query);

  return res.status(200).json({
    success: true,
    message: "Activity logs fetched successfully",
    data: result.data,
    meta: result.meta,
  });
};

// Optional: create log from controller (if needed)
const createActivityLogController = async (req: Request, res: Response) => {
  const result = await ActivityLogService.logActivity(req.body);

  return res.status(201).json({
    success: true,
    message: "Activity log created successfully",
    data: result,
  });
};

export const activityLogController = {
  getActivityLogsController,
  createActivityLogController,
};
