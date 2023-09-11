import Cart from "../models/cartModel";
import { createOne } from "./handleFactory";

export const createCart = createOne(Cart);
