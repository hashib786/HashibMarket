import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signUp,
} from "../controller/authController";
import multer from "multer";
import { uploadImage } from "../controller/userController";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

// Accessible to All Users:
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").patch(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

// Logged-In User Accessible:
router.route("/logout").get(protect, logout);
router.route("/upload").post(protect, upload, uploadImage);

export default router;
