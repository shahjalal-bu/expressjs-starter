/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interfaces/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorMessage = err.issues
    .map(
      (issue) => `${issue.path[0]} is ${issue.message.toLowerCase() as string}`
    )
    .join(". ");

  return {
    statusCode,
    message: "Validation Error",
    errorMessage,
  };
};

export default handleZodError;
