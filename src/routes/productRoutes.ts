import { Router } from "express";
import { createProduct, setSellerId } from "../controller/productController";
import { protect, restrictTo } from "../controller/authController";

const router = Router();

router.use(protect);

// Seller Accessible:
router.use(restrictTo("seller"));
router.route("/").post(setSellerId, createProduct);

export default router;
