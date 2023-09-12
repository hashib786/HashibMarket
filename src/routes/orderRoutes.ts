import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { createOrder } from "../controller/orderController";
import { setUserInBody } from "../controller/wishlistController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect);
router.route("/").post(restrictTo("user"), setUserInBody, createOrder);

export default router;
