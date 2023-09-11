import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { setUserInBody } from "../controller/wishlistController";
import { createReview } from "../controller/reviewController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));
router.route("/").post(setUserInBody, createReview);

export default router;
