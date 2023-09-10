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
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensure quantity is at least 1
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Ensure total price is non-negative
    },
  },
  { timestamps: true },
);

// Create and export the Cart model
export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
