import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { setFilterOnlySameUser, setUserInBody } from "../controller/wishlistController";
import { createCart, getAllUserCart } from "../controller/cartController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));

router.route("/").post(setUserInBody, createCart).get(setFilterOnlySameUser, getAllUserCart);

export default router;
