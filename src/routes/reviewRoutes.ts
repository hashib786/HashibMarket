import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  checkingSameReviewUser,
  createReview,
  deleteReview,
  updateReview,
} from "../controller/reviewController";
import { setUserInBody } from "../controller/handleFactory";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user", "admin"));
router.route("/").post(setUserInBody, createReview);

router.use("/:id", checkingSameReviewUser);
router.route("/:id").patch(updateReview).delete(deleteReview);

export default router;
