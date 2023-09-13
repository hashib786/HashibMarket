import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  checkingSameOrderUser,
  createOrder,
  getAllOrder,
  getOrder,
  sellerOrder,
} from "../controller/orderController";
import { setFilterOnlySameUser, setUserInBody } from "../controller/handleFactory";

const router = Router();

// Logged-In User Accessible: / Admin Accessible:
router.use("/", protect);
router
  .route("/")
  .post(restrictTo("user"), setUserInBody, createOrder)
  .get(restrictTo("user", "admin"), setFilterOnlySameUser, getAllOrder);
router.route("/:id").get(restrictTo("user", "admin"), checkingSameOrderUser, getOrder);

// Seller Accessible:
router.route("/seller/product").get(restrictTo("seller"), sellerOrder);

export default router;
