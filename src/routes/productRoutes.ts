import { Router } from "express";
import { createProduct, getAllProducts, setSellerId } from "../controller/productController";
import { protect, restrictTo } from "../controller/authController";

const router = Router();

// Accessible to All Users:
router.route("/").get(getAllProducts);

router.use(protect);

// Seller Accessible:
router.use(restrictTo("seller"));
router.route("/").post(setSellerId, createProduct);

export default router;
