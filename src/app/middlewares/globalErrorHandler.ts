import { Request, Response, NextFunction } from "express";
import { errorFormatter } from "../ErrorHelpers/errorFormatter";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const formatted = errorFormatter(err);

  res.status(formatted.statusCode).json({
    statusCode: formatted.statusCode,
    success: false,
    message: formatted.message,
    errorDetails: formatted.errorDetails,
    stack: formatted.stack, // only in dev
  });
};
