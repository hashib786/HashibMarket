import { NextFunction, Request, Response } from "express";
import Order from "../models/orderModel";
import { catchAsync } from "../utils/catchAsync";

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const createdOrder = await Order.create(req.body);
  const data = await Order.findById(createdOrder._id);
  res.status(200).json({
    status: "success",
    data: { data },
  });
});
