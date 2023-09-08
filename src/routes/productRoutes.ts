import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  setSellerId,
} from "../controller/productController";
import { protect, restrictTo } from "../controller/authController";

const router = Router();

// Accessible to All Users:
router.route("/").get(getAllProducts);
router.route("/:id").get(getProduct);

router.use(protect);

// Seller Accessible:
router.use(restrictTo("seller"));
router.route("/").post(setSellerId, createProduct);

export default router;
