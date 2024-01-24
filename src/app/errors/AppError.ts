class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      if (this.statusCode == 401) {
        this.stack = "";
      } else {
        this.stack = stack;
      }
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
