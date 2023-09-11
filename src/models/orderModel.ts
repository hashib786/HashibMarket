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
          min: [1, "Quantity must be at least 1"], // Custom message for min constraint
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price must be non-negative"], // Custom message for min constraint
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

// Create and export the Order model
export const OrderModel = mongoose.model<Order>("Order", orderSchema);
