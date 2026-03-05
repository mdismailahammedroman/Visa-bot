/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export interface IActivityLog {
  actorId: Types.ObjectId;
  actorRole: string;

  action: string;
  entityType: string;
  entityId?: Types.ObjectId;

  message?: string;
  status?: "SUCCESS" | "FAILED";


  ip?: string | undefined;          // <-- add | undefined
  userAgent?: string | undefined;   // <-- add | undefined


  meta?: Record<string, any>;
  before?: Record<string, any>;
  after?: Record<string, any>;

  createdAt?: Date;
  updatedAt?: Date;
}
