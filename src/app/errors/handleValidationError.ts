/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error";

const handleValidationError = (
  // eslint-disable-next-line no-unused-vars
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessage: "hi",
  };
};

export default handleValidationError;
