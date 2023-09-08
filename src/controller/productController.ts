import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { createOne, getAll } from "./handleFactory";

export const setSellerId = (req: Request, _: Response, next: NextFunction) => {
  req.body.seller = req.user._id;
  next();
};

export const getAllProducts = getAll(Product);
export const createProduct = createOne(Product);
