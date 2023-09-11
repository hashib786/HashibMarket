import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { setUserInBody } from "../controller/wishlistController";
import { createCart } from "../controller/cartController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));

router.route("/").post(setUserInBody, createCart);

export default router;
