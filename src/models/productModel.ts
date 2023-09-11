import mongoose, { Document, Schema, Types } from "mongoose";
import slugify from "slugify";

// Interface to define the structure of a product
interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  categories: string; // Assuming you're using MongoDB ObjectId for references
  slug: string;
  stockQuantity: number;
  seller: Types.ObjectId; // Assuming you're using MongoDB ObjectId for references
  reviews: Types.ObjectId[]; // Assuming you're using MongoDB ObjectId for references
  createdAt: Date;
  updatedAt: Date;
}

// Create a Mongoose schema for the product model
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "A Product must have name"],
    },
    description: {
      type: String,
      required: [true, "A Product must have description"],
    },
    price: {
      type: Number,
      required: [true, "A Product must have price"],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (this: IProduct, value: number) {
          return this.price > value;
        },
        message: "Discount price must be lesser than price",
      },
    },
    images: {
      type: [String],
      required: [true, "A Product must have "],
    },
    categories: {
      type: String,
      required: [true, "A Product must have categories"],
      lowercase: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "A Product must have stockQuantity"],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to your Seller model
      required: [true, "A Product must have seller"],
    },
    slug: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Virtual Properties
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// ******* Pre Middleware *********
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (this: mongoose.Query<any, any, {}, any, "find">, next) {
  this.populate({ path: "seller", select: "name email address profileImage" });

  next();
});

// Create and export the Product model
const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
