import AppError from "./AppError";
import { handleMongooseError } from "./handleMongooseError";
import { handleZodError } from "./handleZodError";

export type FormattedError = {
  statusCode: number;
  message: string;
  errorDetails?: any;
  stack?: string;
};

const isMongooseError = (err: any) =>
  err?.name === "ValidationError" ||
  err?.name === "CastError" ||
  err?.name === "MongoServerError" ||
  err?.code === 11000;

export const errorFormatter = (err: any): FormattedError => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: any = undefined;

  //  AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  //  Zod
  else if (err?.name === "ZodError") {
    const zod = handleZodError(err);
    statusCode = zod.statusCode;
    message = zod.message;
    errorDetails = zod.errorDetails;
  }

  //  Joi
  else if (err?.isJoi && Array.isArray(err?.details)) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.details;
  }

  //  JWT
  else if (err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  //  Mongoose / Mongo
  else if (isMongooseError(err)) {
    const appError = handleMongooseError(err);
    statusCode = appError.statusCode;
    message = appError.message;
  }

  //  Unknown error
  else if (err instanceof Error) {
    message = err.message;
  }

  return {
    statusCode,
    message,
    errorDetails,
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  };
};
