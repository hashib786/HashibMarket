// Import necessary libraries if required
import crypto from "crypto";
import mongoose, { Document, Schema, Types, model } from "mongoose";
import bcrypt from "bcryptjs";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  role: string;
  address: string;
  profileImage: string;
  cart: Types.ObjectId;
  wishlist: Types.ObjectId;
  orders: Types.ObjectId[];
  reviews: Types.ObjectId[];
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  passwordChangeAt: Date | undefined;
  isActive: Boolean;
  createdAt: Date;
  updatedAt: Date;
  isCorrectPassword(userPass: string, hashPass: string): Promise<Boolean>;
  createPasswordResetToken(): string;
  isPasswordChanged(jwtTime: number): boolean;
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
      select: false,
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
      default: "user",
    },
    address: {
      type: String,
      required: [true, "Address is required."],
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dpvwypdrj/image/upload/v1694081465/users/ajxlslhncfxwkoud7qud.jpg",
    },
    isActive: {
      type: Boolean,
      default: true,
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
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangeAt: Date,
  },
  {
    timestamps: true,
  }
);

//  ******** Pre Middlewares ***********
// Hashing Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 14);
  this.passwordConfirm = undefined;

  next();
});

// if password update update passwordChangeAt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = new Date(Date.now() - 1000);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, any, {}, any, "find">, next) {
    this.find({ isActive: { $ne: false } });
    next();
  }
);

// ********* Methods ************
userSchema.methods.isCorrectPassword = async function (
  userPass: string,
  hashPass: string
): Promise<Boolean> {
  return await bcrypt.compare(userPass, hashPass);
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(14).toString("hex");
  // const resetTokenHex = crypto.randomBytes(14).toString();

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.isPasswordChanged = function (jwtTime: number): boolean {
  if (this.passwordChangeAt) {
    // Deviding thousent because jwt iat time is already devided 1000
    const changePasswordTime =
      parseInt(this.passwordChangeAt.getTime(), 10) / 1000;
    return jwtTime < changePasswordTime;
  }
  return false;
};

// Create the User model
const User = model<IUser>("User", userSchema);

export default User;
