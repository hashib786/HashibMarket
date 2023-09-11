import Cart from "../models/cartModel";
import { createOne, getAll } from "./handleFactory";

export const createCart = createOne(Cart);
export const getAllUserCart = getAll(Cart);
