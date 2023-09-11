import { Router } from "express";
import { protect, restrictTo } from "../controller/authController";
import { setFilterOnlySameUser, setUserInBody } from "../controller/wishlistController";
import {
  checkingSameCartUser,
  createCart,
  getAllUserCart,
  updateCart,
} from "../controller/cartController";

const router = Router();

// Logged-In User Accessible:
router.use("/", protect, restrictTo("user"));
router.route("/").post(setUserInBody, createCart).get(setFilterOnlySameUser, getAllUserCart);

router.use("/:id", checkingSameCartUser);
router.route("/:id").patch(updateCart);

export default router;
