import { Router } from "express";
import { getAllSeller, getSeller, isSeller, setSellerFilter } from "../controller/sellerController";
import { protect, restrictTo } from "../controller/authController";

const router = Router();

// Accessible to All Users:
router.use("/:sellerId", isSeller);
router.route("/:sellerId").get(getSeller);

// Admin Accessible:
router.use("/", protect, restrictTo("admin"));
router.route("/").get(setSellerFilter, getAllSeller);

export default router;
