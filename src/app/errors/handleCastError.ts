import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorMessage = `${Object.values(err.value)[0]} is not a valid ID!`;

  return {
    statusCode,
    errorMessage,
    message: "Cast Error",
  };
};

export default handleCastError;
