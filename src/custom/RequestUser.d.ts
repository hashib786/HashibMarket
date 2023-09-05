import { IUser } from "../models/userModel";

// Define a custom type to extend the Express Request type
export declare global {
  namespace Express {
    interface Request {
      user: IUser; // Adjust the type according to your user data structure
    }
  }
}
