import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { createOne, getAll, getOne, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const setSellerId = (req: Request, _: Response, next: NextFunction) => {
  req.body.seller = req.user._id;
  next();
};

export const getAllProducts = getAll(Product);
export const createProduct = createOne(Product);
export const getProduct = getOne(Product);

export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new AppError("Not finding product given id: ", 401));
  if (product.seller !== req.user._id)
    return next(new AppError("You are not created this product: ", 401));

  const data = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { data },
  });
});
