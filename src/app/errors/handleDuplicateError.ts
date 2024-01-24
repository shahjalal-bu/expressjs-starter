import { TGenericErrorResponse } from "../interfaces/error";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  //extract value within double quotes
  const match = err.message.match(/"([^"]*)"/);
  const exactedMessage = match && match[1];

  const statusCode = 400;
  return {
    statusCode,
    message: "Duplicate Entry",
    errorMessage: `${exactedMessage} is already exists `,
  };
};

export default handleDuplicateError;
