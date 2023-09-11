import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { setUserInBody } from "../controller/wishlistController";
import { checkingSameReviewUser, createReview, updateReview } from "../controller/reviewController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));
router.route("/").post(setUserInBody, createReview);

router.use("/:id", checkingSameReviewUser);
router.route("/:id").patch(updateReview);

export default router;
