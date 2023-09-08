import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { createOne } from "./handleFactory";

export const setSellerId = (req: Request, _: Response, next: NextFunction) => {
  req.body.seller = req.user._id;
  next();
};

export const createProduct = createOne(Product);
