import { Router } from "express";
import { getAllSeller, getSeller, setSellerFilter } from "../controller/sellerController";
import { protect, restrictTo } from "../controller/authController";

const router = Router();

// Accessible to All Users:
router.route("/:sellerId").get(getSeller);

// Admin Accessible:
router.use("/", protect, restrictTo("admin"));
router.route("/").get(setSellerFilter, getAllSeller);

export default router;