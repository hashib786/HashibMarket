import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Product schema
interface Product {
  product: mongoose.Types.ObjectId; // Reference to Product model
  quantity: number;
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
interface Order extends Document {
  user: Types.ObjectId; // Reference to User model
  products: Product[];
  totalPrice: number;
  orderStatus: "Processing" | "Shipped" | "Out for Delivery" | "Delivered"; // Reference to OrderStatus model
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Order schema
const orderSchema = new Schema<Order>(
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
          min: 1, // Ensure quantity is at least 1
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Ensure total price is non-negative
    },
    orderStatus: {
      type: String,
      required: true,
      enum: {
        values: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
        message: `Please give statuse "Processing" | "Shipped" | "Out for Delivery" | "Delivered" One of them`,
      },
      default: "Processing",
    },
    shippingAddress: {
      type: new Schema<ShippingAddress>(
        {
          street: {
            type: String,
            required: true,
          },
          city: {
            type: String,
            required: true,
          },
          state: {
            type: String,
            required: true,
          },
          postalCode: {
            type: String,
            required: true,
          },
          country: {
            type: String,
            required: true,
          },
        },
        { _id: false }, // Exclude _id field from ShippingAddress
      ),
      required: true,
    },
  },
  { timestamps: true },
);

// Create and export the Order model
export const OrderModel = mongoose.model<Order>("Order", orderSchema);
