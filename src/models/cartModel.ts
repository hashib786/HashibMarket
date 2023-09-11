import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Cart schema
interface Cart extends Document {
  user: Types.ObjectId; // Reference to User model
  product: Types.ObjectId; // Array of products in the cart with quantities
  quantity: number; // Total price of items in the cart
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
  { timestamps: true },
);

cartSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any, "find">, next) {
  this.populate({
    path: "product",
    select: "name price images stockQuantity",
  });

  next();
});

// Create and export the Cart model
const Cart = mongoose.model<Cart>("Cart", cartSchema);
export default Cart;
