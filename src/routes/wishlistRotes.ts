import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  getAllUserWishlist,
  createWishlist,
  setFilterOnlySameUser,
  setUserInBody,
  checkingSameWishlistUser,
  deleteWishlist,
  clearWishlist,
} from "../controller/wishlistController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));
router
  .route("/")
  .post(setUserInBody, createWishlist)
  .get(setFilterOnlySameUser, getAllUserWishlist)
  .delete(setFilterOnlySameUser, clearWishlist);

router.use("/:id", checkingSameWishlistUser);
router.route("/:id").delete(deleteWishlist);

export default router;
