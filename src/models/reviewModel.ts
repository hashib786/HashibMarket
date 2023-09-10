import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Review schema
interface Review extends Document {
  user: Types.ObjectId; // Reference to User model
  product: Types.ObjectId; // Reference to Product model
  rating: number; // A numeric rating, e.g., 1 to 5 stars
  comment: string; // The review comment
  createdAt: Date;
  updatedAt: Date;
}

// Create the Review schema
const reviewSchema = new Schema<Review>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Minimum rating (e.g., 1 star)
      max: 5, // Maximum rating (e.g., 5 stars)
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Create and export the Review model
export const ReviewModel = mongoose.model<Review>("Review", reviewSchema);
