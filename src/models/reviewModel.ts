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
      required: [true, "User ID is required for a review."],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required for a review."],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required for a review."],
      min: [1, "Minimum rating is 1 star."],
      max: [5, "Maximum rating is 5 stars."],
    },
    comment: {
      type: String,
      required: [true, "Comment is required for a review."],
    },
  },
  { timestamps: true },
);

// Create and export the Review model
const Review = mongoose.model<Review>("Review", reviewSchema);
export default Review;
