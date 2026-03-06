/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActivityLogRepository } from "./activityLog.repository";
import { IActivityLog } from "./activityLog.interface";

  // Generic helper to create log
  const logActivity= async (payload: Partial<IActivityLog>) => {
    return await ActivityLogRepository.create(payload);
  }

  // Get paginated logs with optional query filters
  const getActivityLogs= async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const filters: any = {};
    if (query.actorRole) filters.actorRole = query.actorRole;
    if (query.action) filters.action = query.action;
    if (query.entityType) filters.entityType = query.entityType;
    if (query.status) filters.status = query.status;

    return await ActivityLogRepository.findAll(filters, page, limit);
  }

  // Get single log by ID
  const getLogById= async (id: string) => {
    return await ActivityLogRepository.findById(id);
  }

  // Delete log by ID
  const deleteLog= async (id: string) => {
    return await ActivityLogRepository.deleteById(id);
  }

export const ActivityLogService = {
  logActivity,
  getActivityLogs,
  getLogById,
  deleteLog,
};