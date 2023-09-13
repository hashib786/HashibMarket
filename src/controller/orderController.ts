import { NextFunction, Request, Response } from "express";
import Order, { IOrder } from "../models/orderModel";
import { catchAsync } from "../utils/catchAsync";
import { checkingSameUser, getAll, getOne, updateOne } from "./handleFactory";
import { AppError } from "../utils/AppError";

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const createdOrder = await Order.create(req.body);

  // For Updating Total price so that's why calling second time
  const data = await Order.findById(createdOrder._id);
  res.status(200).json({
    status: "success",
    data: { data },
  });
});

export const sellerOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sellerId = req.user._id;

  const sellerOrders = await Order.aggregate<IOrder>([
    {
      $unwind: "$products",
    },
    {
      $match: {
        "products.seller": sellerId,
      },
    },
    {
      $group: {
        _id: "$_id", // Group by the order's _id field (order ID)
        orderStatus: { $first: "$orderStatus" }, // Get the orderStatus (assuming it's the same for all products in an order)
        products: { $push: "$products" }, // Push products into an array for each order
        totalPrice: { $sum: "$products.afterDiscount" }, // Calculate the total price for the seller's products
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { sellerOrders },
  });
});

export const getOrderDetailsForSeller = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId).populate({
      path: "products.product",
      select: "-__v",
    });

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    let totalPrice = 0;
    const products = order.products.filter((product) => {
      if (product.seller.toString() === req.user.id) {
        totalPrice += product.afterDiscount;
        return true;
      }
      return false;
    });

    res.status(200).json({
      status: "success",
      data: { totalPrice, products },
    });
  },
);

export const getAllOrder = getAll(Order);
export const checkingSameOrderUser = checkingSameUser(Order);
export const getOrder = getOne(Order);
export const updateOrder = updateOne(Order);
