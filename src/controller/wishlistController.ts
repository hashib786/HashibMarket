import { NextFunction, Request, Response } from "express";
import Wishlist from "../models/wishlistModel";
import {
  checkingSameUser,
  createOne,
  deleteMany,
  deleteOne,
  getAll,
  updateOne,
} from "./handleFactory";
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

export const checkingSameWishlistUser = checkingSameUser(Wishlist);
export const createWishlist = createOne(Wishlist);
export const getAllUserWishlist = getAll(Wishlist);
export const deleteWishlist = deleteOne(Wishlist);
export const clearWishlist = deleteMany(Wishlist);
