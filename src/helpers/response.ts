import { Response } from "express";

export const respondSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: Record<any, any> | Array<Record<any, any>>,
) =>
  res
    .status(statusCode)
    .json({
      message,
      data,
    })
    .end();

export const respondError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: Record<string, any>,
) =>
  res
    .status(statusCode)
    .json({
      message,
      error,
    })
    .end();
