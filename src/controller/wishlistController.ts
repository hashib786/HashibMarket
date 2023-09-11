import { NextFunction, Request, Response } from "express";
import Wishlist from "../models/wishlistModel";
import { createOne, getAll } from "./handleFactory";

export const setUserInBody = (req: Request, res: Response, next: NextFunction) => {
  req.body.user = req.user._id;
  next();
};

export const setFilterOnlyLoginUser = (req: Request, res: Response, next: NextFunction) => {
  req.body.filter = { user: req.user._id };
  next();
};

export const createWishlist = createOne(Wishlist);
export const getAllUserWishlist = getAll(Wishlist);
