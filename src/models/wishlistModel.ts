import mongoose, { Document, Types, Schema } from "mongoose";

// Define the Wishlist schema
interface Wishlist extends Document {
  user: Types.ObjectId; // Reference to User model
  productsSaved: Types.ObjectId[]; // Array of product references
  createdAt: Date;
  updatedAt: Date;
}

// Create the Wishlist schema
const wishlistSchema = new Schema<Wishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productsSaved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

// Create and export the Wishlist model
export const WishlistModel = mongoose.model<Wishlist>("Wishlist", wishlistSchema);
