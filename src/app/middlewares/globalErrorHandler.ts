import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode: number = 500;
  let message: string = "Internal Server Error";
  let errorMessage: string = "Internal Server Error";
  let stack = err.stack;
  let errorDetails = err;

  //zod error handling
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  //validation error handling
  else if (err?.name === "validationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  //cast error handling
  else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  // handle duplicate error
  else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
  //handle appError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessage = err.message;
    if (statusCode === 401 || statusCode === 403) {
      message = "Unauthorized Access";
      errorMessage =
        "You do not have the necessary permissions to access this resource.";
      stack = null;
      errorDetails = null;
    }
    if (statusCode === 421) {
      statusCode = 400;
      message =
        "Password change failed. Ensure the new password is unique and not among the last 2 used.";
      errorMessage =
        "Password change failed. Ensure the new password is unique and not among the last 2 used";
      stack = null;
      errorDetails = null;
    }
  }
  //handle error
  else if (err instanceof Error) {
    message = err.message;
    errorMessage = err.message;
  }
  //ultimate error
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack,
  });
};

export default globalErrorHandler;
