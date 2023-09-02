import { NextFunction, Request, Response } from "express";

export const catchAsync = (
  asyncFunc: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFunc(req, res, next).catch(next);
  };
};
