import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/userModel";
import { AppError } from "../utils/AppError";

export const getSeller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { sellerId } = req.params;
  const seller = await User.findById(sellerId);
  if (!seller || !(seller.role === "seller"))
    return next(new AppError("Not find any seller with given Id", 404));

  res.status(200).json({
    status: "success",
    data: { seller },
  });
});
