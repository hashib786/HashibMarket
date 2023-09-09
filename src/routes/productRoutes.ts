import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductWithSlug,
  setSellerId,
  updateProduct,
  uploadProductIMage,
} from "../controller/productController";
import { protect, restrictTo } from "../controller/authController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images");

const router = Router();

// Accessible to All Users:
router.route("/").get(getAllProducts);
router.route("/:id").get(getProduct);

// Logged-In User Accessible:
router.use(protect);
router.route("/name/:slug").get(getProductWithSlug);

// Seller Accessible:
router.use(restrictTo("seller", "admin"));
router.route("/").post(upload, setSellerId, uploadProductIMage, createProduct);
router.route("/:id").patch(upload, uploadProductIMage, updateProduct);

export default router;
