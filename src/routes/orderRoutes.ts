import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { createOrder, getAllOrder } from "../controller/orderController";
import { setFilterOnlySameUser, setUserInBody } from "../controller/handleFactory";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect);
router
  .route("/")
  .post(restrictTo("user"), setUserInBody, createOrder)
  .get(restrictTo("user", "admin"), setFilterOnlySameUser, getAllOrder);

export default router;
