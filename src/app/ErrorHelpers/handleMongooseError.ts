/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "./AppError";

export const handleMongooseError = (err: any) => {
  // Duplicate key (unique field violation)
  if (err?.code === 11000) {
    const field = Object.keys(err?.keyValue || {})[0];
    return new AppError(409, `Duplicate value for ${field}`);
  }

  // Cast error (invalid ObjectId)
  if (err?.name === "CastError") {
    return new AppError(400, `Invalid ${err?.path}`);
  }

  // Validation error (required field missing, schema mismatch)
  if (err?.name === "ValidationError") {
    return new AppError(400, "Validation Error");
  }

  return new AppError(500, "Database Error"); // Unknown Mongo error
};
