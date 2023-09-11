import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  getAllUserWishlist,
  createWishlist,
  setFilterOnlyLoginUser,
  setUserInBody,
} from "../controller/wishlistController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"), setUserInBody);
router.route("/").post(createWishlist).get(setFilterOnlyLoginUser, getAllUserWishlist);

export default router;
