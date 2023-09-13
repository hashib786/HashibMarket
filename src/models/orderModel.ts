import mongoose, { Document, Schema, Types } from "mongoose";
import Product from "./productModel";
import { AppError } from "../utils/AppError";

// Define the Product schema
interface Product {
  product: Types.ObjectId; // Reference to Product model
  quantity: number;
  afterDiscount: number | undefined;
  seller: Types.ObjectId;
}

// Define the Shipping Address schema
interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Define the Order schema
export interface IOrder extends Document {
  user: Types.ObjectId; // Reference to User model
  products: Product[];
  totalPrice: number;
  orderStatus: "Processing" | "Shipped" | "Out for Delivery" | "Delivered"; // Reference to OrderStatus model
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Order schema
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must have user id"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Order must have product id"],
        },
        quantity: {
          type: Number,
          required: [true, "Order must have quantity"],
          min: [1, "Quantity must be at least 1"], // Custom message for min constraint
          default: 1,
        },
        seller: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: [true, "Order must have seller"],
        },
        afterDiscount: {
          type: Number,
          set: (val: number) => parseFloat(val.toFixed(2)),
        },
        _id: false,
      },
    ],
    totalPrice: {
      type: Number,
      min: [0, "Total price must be non-negative"], // Custom message for min constraint
      set: (val: number) => parseFloat(val.toFixed(2)),
    },

    orderStatus: {
      type: String,
      required: [true, "Order status is required"],
      enum: {
        values: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
        message: "Invalid order status value",
      },
      default: "Processing",
    },
    shippingAddress: {
      type: new Schema<ShippingAddress>(
        {
          street: {
            type: String,
            required: [true, "Street address is required"],
          },
          city: {
            type: String,
            required: [true, "City is required"],
          },
          state: {
            type: String,
            required: [true, "State is required"],
          },
          postalCode: {
            type: String,
            required: [true, "Postal code is required"],
          },
          country: {
            type: String,
            required: [true, "Country is required"],
          },
        },
        { _id: false }, // Exclude _id field from ShippingAddress
      ),
      required: [true, "Shipping address is required"],
    },
  },
  { timestamps: true },
);

// This middleware calculates the order total price with discounts and updates afterDiscount
orderSchema.post("save", async function (val, next) {
  let totalPrice = 0;
  let error = "";

  // Loop through the products in the order
  const promises = val.products.map(async ({ product, quantity }) => {
    // Find the product data by its ID
    const productData = await Product.findById(product);

    if (productData) {
      // Calculate the price and discount for the product
      const price = productData.price;
      const discount = productData.discountPrice || 0;
      const afterDiscount = price - discount; // Calculate afterDiscount
      totalPrice += afterDiscount * quantity; // Use afterDiscount when calculating the total price

      // Find the index of the product in the order's products array
      const productIndex = val.products.findIndex((p) => p.product.equals(product));
      if (productIndex !== -1) {
        // Update the afterDiscount value for the product in the order
        val.products[productIndex].afterDiscount = afterDiscount;
      }
    } else {
      // Handle the case where the product ID is not valid
      error += `Product ID : ${product} is Not Valid. `;
    }
  });

  await Promise.all(promises);

  if (error) {
    // If there are errors, delete the order and return an error response
    await Order.findByIdAndDelete(val._id);
    return next(new AppError(`${error}`, 401));
  }

  // Update the order with the calculated total price and updated products
  await Order.findByIdAndUpdate(val._id, { totalPrice, products: val.products });

  next();
});

// Create and export the Order model
const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
