import { ZodError } from "zod";

export type ZodFormatted = {
  statusCode: number;
  message: string;
  errorDetails: Array<{
    path: string;
    message: string;
  }>;
};

export const handleZodError = (err: ZodError): ZodFormatted => {
  const errorDetails = err.issues.map((issue) => ({
    path: issue.path.join(".") || "root",
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorDetails,
  };
};
