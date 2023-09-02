import { NextFunction, Request, Response } from "express";

export const errorController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).json({
    status: "error",
    error: err,
  });
};
