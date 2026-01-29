import AppError from "./AppError";
import { handleMongooseError } from "./handleMongooseError";
import { handleZodError } from "./handleZodError";

export type FormattedError = {
  statusCode: number; // HTTP status
  message: string; // Error message
  errorDetails?: any; // Validation error বা extra info
  stack?: string; // Development এ stack trace দেখানোর জন্য
};

// Mongoose error কি কিনা check করার function
const isMongooseError = (err: any) =>
  err?.name === "ValidationError" ||
  err?.name === "CastError" ||
  err?.name === "MongoServerError" ||
  err?.code === 11000;

// মূল function, সব ধরনের error কে standard format এ convert করে
export const errorFormatter = (err: any): FormattedError => {
  let statusCode = 500; // default internal server error
  let message = "Internal Server Error";
  let errorDetails: any = undefined;

  // যদি custom AppError হয়
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // যদি Zod validation error হয়
  else if (err?.name === "ZodError") {
    const zod = handleZodError(err);
    statusCode = zod.statusCode;
    message = zod.message;
    errorDetails = zod.errorDetails;
  }

  // যদি Joi validation error হয়
  else if (err?.isJoi && Array.isArray(err?.details)) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.details;
  }

  // JWT related errors
  else if (err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Mongoose/MongoDB errors
  else if (isMongooseError(err)) {
    const appError = handleMongooseError(err);
    statusCode = appError.statusCode;
    message = appError.message;
  }

  // Unknown JS errors
  else if (err instanceof Error) {
    message = err.message;
  }

  return {
    statusCode,
    message,
    errorDetails,
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined, // শুধু development এ stack দেখাবে
  };
};
