import Cart from "../models/cartModel";
import { checkingSameUser, createOne, getAll, updateOne } from "./handleFactory";

export const checkingSameCartUser = checkingSameUser(Cart);
export const createCart = createOne(Cart);
export const getAllUserCart = getAll(Cart);
export const updateCart = updateOne(Cart);
