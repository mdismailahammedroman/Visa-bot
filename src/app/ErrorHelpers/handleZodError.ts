import { ZodError } from "zod";

export type ZodFormatted = {
  statusCode: number;
  message: string;
  errorDetails: Array<{
    path: string; // কোন field ত্রুটি আছে
    message: string; // error message
  }>;
};

export const handleZodError = (err: ZodError): ZodFormatted => {
  const errorDetails = err.issues.map((issue) => ({
    path: issue.path.join(".") || "root", // nested field support
    message: issue.message,
  }));

  return {
    statusCode: 400, // validation error
    message: "Validation Error",
    errorDetails,
  };
};
