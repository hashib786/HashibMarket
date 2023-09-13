import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  checkingSameCartUser,
  clearCart,
  createCart,
  deleteCart,
  getAllUserCart,
  updateCart,
} from "../controller/cartController";
import { setFilterOnlySameUser, setUserInBody } from "../controller/handleFactory";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));
router
  .route("/")
  .post(setUserInBody, createCart)
  .get(setFilterOnlySameUser, getAllUserCart)
  .delete(setFilterOnlySameUser, clearCart);

router.use("/:id", checkingSameCartUser);
router.route("/:id").patch(updateCart).delete(deleteCart);

export default router;
