// Import necessary libraries if required
import { Document, Schema, Types, model } from "mongoose";

// Define the User interface
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
  address: string;
  profileImage: string;
  cart: Types.ObjectId; // You can replace this with the actual reference type
  wishlist: Types.ObjectId; // You can replace this with the actual reference type
  orders: Types.ObjectId[]; // You can replace this with the actual reference type
  reviews: Types.ObjectId[]; // You can replace this with the actual reference type
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true, // Remove leading/trailing white spaces
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password is required."],
      validate: {
        validator: function (this: IUser, value: string): boolean {
          return this.password === value;
        },
        // message: 'Passwords do not match.', // Custom error message
        message: (props) => `${props.value} --> Passwords do not match.`,
      },
    },
    role: {
      type: String,
      required: [true, "Role is required."],
      enum: {
        values: ["user"],
        message: "enum validator failed for path `{PATH}` with value `{VALUE}`",
      }, // Example of enum validation
    },
    address: {
      type: String,
      required: [true, "Address is required."],
    },
    profileImage: {
      type: String,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    wishlist: {
      type: Schema.Types.ObjectId,
      ref: "Wishlist",
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the User model
const UserModel = model<IUser>("User", userSchema);

export default UserModel;