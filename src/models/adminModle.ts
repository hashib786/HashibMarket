import { Schema, model } from "mongoose";

interface IAdmin {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: {
        values: ["admin"],
        message: "Only Admin",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;
