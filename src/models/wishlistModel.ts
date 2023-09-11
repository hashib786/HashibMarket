import mongoose, { Document, Types, Schema } from "mongoose";

// Define the Wishlist schema
interface Wishlist extends Document {
  user: Types.ObjectId; // Reference to User model
  productsSaved: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Wishlist schema
const wishlistSchema = new Schema<Wishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A wishlist must have a user"],
    },
    productsSaved: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true },
);

wishlistSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any, "find">, next) {
  this.populate({ path: "productsSaved", select: "name price image" });
  next();
});

// Create and export the Wishlist model
const Wishlist = mongoose.model<Wishlist>("Wishlist", wishlistSchema);
export default Wishlist;
