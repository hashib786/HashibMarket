import mongoose, { Document, Types, Schema } from "mongoose";

// Define the Payment schema
interface Payment extends Document {
  user: Types.ObjectId; // Reference to User model
  order: Types.ObjectId; // Reference to Order model
  paymentMethod: string; // Payment method used, e.g., credit card, PayPal, etc.
  transactionID: string; // Unique transaction ID associated with the payment
  paymentStatus: "Paid" | "Pending" | "Failed"; // Payment status, e.g., "Paid," "Pending," "Failed," etc.
  createdAt: Date;
  updatedAt: Date;
}

// Create the Payment schema
const paymentSchema = new Schema<Payment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for payment."], // Added custom error message
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order ID is required for payment."], // Added custom error message
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required."], // Added custom error message
      enum: {
        values: ["Paid", "Pending", "Failed"],
        message: "Payment method is not supported",
      },
      default: "Pending",
    },
    transactionID: {
      type: String,
      required: [true, "Transaction ID is required for payment."], // Added custom error message
    },
    paymentStatus: {
      type: String,
      required: [true, "Payment status is required."], // Added custom error message
    },
  },
  { timestamps: true },
);

// Create and export the Payment model
export const PaymentModel = mongoose.model<Payment>("Payment", paymentSchema);
