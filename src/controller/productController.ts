import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { createOne, getAll, getOne, updateOne } from "./handleFactory";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { bufferUpload } from "./userControllerForImage";

export const uploadProductIMage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    if (files) {
      const urls = files.map(
        async (file: { buffer: Buffer }) => (await bufferUpload(file.buffer, "folder"))?.secure_url,
      );
      req.body.images = await Promise.all(urls);
    }

    next();
  },
);

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

  if (product.seller.id !== req.user.id)
    return next(new AppError("You are not created this product: ", 401));

  // For Uploading multiple Images

  const data = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { data },
  });
});
