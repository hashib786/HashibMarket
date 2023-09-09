import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/userModel";
import { AppError } from "../utils/AppError";
import { deleteOne, getAll, updateOne } from "./handleFactory";

export const isSeller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { sellerId } = req.params;
  const seller = await User.findById(sellerId);
  if (!seller || !(seller.role === "seller"))
    return next(new AppError("Not find any seller with given Id", 404));

  req.user = seller;
  next();
});

export const getSeller = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    data: { seller: req.user },
  });
});

export const setSellerFilter = (req: Request, res: Response, next: NextFunction) => {
  req.body.filter = { role: "seller" };
  next();
};

export const getAllSeller = getAll(User);
export const updateSeller = updateOne(User);
export const deleteSeller = deleteOne(User);
