/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { ActivityLog } from "./activityLog.model";
import { IActivityLog } from "./activityLog.interface";

// Create a new log
const create = async (payload: Partial<IActivityLog>) => {
  const createPayload: any = {
    ...payload,
    status: payload.status ?? "SUCCESS",
  };

  if (payload.actorId) {
    createPayload.actorId = new Types.ObjectId(payload.actorId);
  }

  if (payload.entityId) {
    createPayload.entityId = new Types.ObjectId(payload.entityId);
  }

  return await ActivityLog.create(createPayload);
};

// Fetch logs with pagination and optional filters
const findAll = async (filters: any = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    ActivityLog.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("actorId", "full_name role"),
    ActivityLog.countDocuments(filters),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: { page, limit, total, totalPage },
  };
};

// Find by ID
const findById = async (id: string) => {
  return await ActivityLog.findById(id).populate("actorId", "full_name role");
};

// Delete by ID
const deleteById = async (id: string) => {
  return await ActivityLog.findByIdAndDelete(id);
};

export const ActivityLogRepository = {
  create,
  findAll,
  findById,
  deleteById,
};
