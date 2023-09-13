import Wishlist from "../models/wishlistModel";
import { checkingSameUser, createOne, deleteMany, deleteOne, getAll } from "./handleFactory";

export const checkingSameWishlistUser = checkingSameUser(Wishlist);
export const createWishlist = createOne(Wishlist);
export const getAllUserWishlist = getAll(Wishlist);
export const deleteWishlist = deleteOne(Wishlist);
export const clearWishlist = deleteMany(Wishlist);
