import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  checkingSameOrderUser,
  createOrder,
  getAllOrder,
  getOrder,
  getOrderDetailsForSeller,
  sellerOrder,
  updateOrder,
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
router.route("/seller/product/:orderId").get(restrictTo("seller"), getOrderDetailsForSeller);

// Admin Accessible:
// seller not update because in order there another seller also available so not write to update order status by any other seller
router.route("/:id").patch(restrictTo("admin"), updateOrder);

export default router;
