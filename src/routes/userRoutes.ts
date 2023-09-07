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
import { uploadImage, uploadManyImage } from "../controller/userController";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
const uploadMany = multer({ storage }).array("file", 3);

// Accessible to All Users:
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").patch(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

// Logged-In User Accessible:
router.route("/logout").get(protect, logout);
router.route("/upload").post(protect, upload, uploadImage);
router.route("/uploadMany").post(protect, uploadMany, uploadManyImage);

export default router;
