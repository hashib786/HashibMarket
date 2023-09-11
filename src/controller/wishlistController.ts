import { NextFunction, Request, Response } from "express";
import Wishlist from "../models/wishlistModel";
import { createOne, deleteOne, getAll, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const setUserInBody = (req: Request, res: Response, next: NextFunction) => {
  req.body.user = req.user._id;
  next();
};

export const setFilterOnlySameUser = (req: Request, res: Response, next: NextFunction) => {
  req.body.filter = { user: req.user._id };
  next();
};

export const checkingSameUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const wishlist = await Wishlist.findById(id);
    if (!wishlist) return next(new AppError("Not finding wishlist given id: ", 401));

    if (wishlist.user.toString() !== req.user.id)
      return next(new AppError("You are not created this wishlist: ", 401));

    next();
  },
);

export const createWishlist = createOne(Wishlist);
export const getAllUserWishlist = getAll(Wishlist);
export const deleteWishlist = deleteOne(Wishlist);
