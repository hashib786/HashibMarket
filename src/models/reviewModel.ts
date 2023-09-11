import mongoose, { Document, Model, Schema, Types } from "mongoose";
import Product from "./productModel";

// Define the Review schema
interface Review extends Document {
  user: Types.ObjectId; // Reference to User model
  product: Types.ObjectId; // Reference to Product model
  rating: number; // A numeric rating, e.g., 1 to 5 stars
  comment: string; // The review comment
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewModel extends Model<Review> {
  calcAverageRating(tourId: Types.ObjectId): void;
}

// Create the Review schema
const reviewSchema = new Schema<Review, ReviewModel>(
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

reviewSchema.static("calcAverageRating", async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const { length } = stats;
  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: length ? stats[0].avgRating : 4.5,
    ratingsQuantity: length ? stats[0].nRating : 0,
  });
});

reviewSchema.post("save", function (val, next) {
  calculateAvg(val.product);
  next();
});

reviewSchema.post(
  /^findOne/,
  function (this: mongoose.Query<any, any, {}, any, "find">, val, next) {
    if (val) calculateAvg(val.product);
    next();
  },
);

// Create and export the Review model
const Review = mongoose.model<Review, ReviewModel>("Review", reviewSchema);

function calculateAvg(productId: Types.ObjectId) {
  Review.calcAverageRating(productId);
}

export default Review;
