import Cart from "../models/cartModel";
import {
  checkingSameUser,
  createOne,
  deleteOne,
  getAll,
  updateOne,
  deleteMany,
} from "./handleFactory";

export const checkingSameCartUser = checkingSameUser(Cart);
export const createCart = createOne(Cart);
export const getAllUserCart = getAll(Cart);
export const updateCart = updateOne(Cart);
export const deleteCart = deleteOne(Cart);
export const clearCart = deleteMany(Cart);
