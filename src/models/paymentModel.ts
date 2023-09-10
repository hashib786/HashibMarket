import mongoose, { Document, Types, Schema } from "mongoose";

// Define the Payment schema
interface Payment extends Document {
  user: Types.ObjectId; // Reference to User model
  order: Types.ObjectId; // Reference to Order model
  paymentMethod: string; // Payment method used, e.g., credit card, PayPal, etc.
  transactionID: string; // Unique transaction ID associated with the payment
  paymentStatus: string; // Payment status, e.g., "Paid," "Pending," "Failed," etc.
  createdAt: Date;
  updatedAt: Date;
}

// Create the Payment schema
const paymentSchema = new Schema<Payment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionID: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Create and export the Payment model
export const PaymentModel = mongoose.model<Payment>("Payment", paymentSchema);
