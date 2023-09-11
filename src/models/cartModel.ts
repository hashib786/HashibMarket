import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Product schema within the Cart
interface CartProduct {
  product: Types.ObjectId; // Reference to Product model
  quantity: number;
}

// Define the Cart schema
interface Cart extends Document {
  user: Types.ObjectId; // Reference to User model
  products: CartProduct[]; // Array of products in the cart with quantities
  totalPrice: number; // Total price of items in the cart
  createdAt: Date;
  updatedAt: Date;
}

// Create the Cart schema
const cartSchema = new Schema<Cart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for the cart."], // Added custom error message
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required for the cart item."], // Added custom error message
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required for the cart item."], // Added custom error message
          min: [1, "Quantity must be at least 1."], // Added custom error message
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required for the cart."], // Added custom error message
      min: [0, "Total price must be non-negative."], // Added custom error message
    },
  },
  { timestamps: true },
);

// Create and export the Cart model
export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
