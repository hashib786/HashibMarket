import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signUp,
} from "../controller/authController";

const router = Router();

// Accessible to All Users:
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").patch(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

// Logged-In User Accessible:
router.route("/logout").get(protect, logout);

export default router;
