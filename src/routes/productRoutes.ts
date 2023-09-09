import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
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

router.use(protect);

// Seller Accessible:
router.use(restrictTo("seller"));
router.route("/").post(setSellerId, upload, uploadProductIMage, createProduct);
router.route("/:id").patch(upload, uploadProductIMage, updateProduct);

export default router;
