import { Response } from "express";

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  message?: string;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  let meta;
  if (data?.meta) {
    meta = {
      page: Number(data?.meta?.page) || 1,
      limit: Number(data?.meta?.limit) || 10,
      total: data?.meta?.total,
    };
  }

  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data?.statusCode,
    meta,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
