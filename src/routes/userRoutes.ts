import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signUp,
  updatePassword,
} from "../controller/authController";
import multer from "multer";
import { uploadImage, uploadManyImage } from "../controller/userControllerForImage";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUser,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "../controller/userController";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profileImage");
const uploadMany = multer({ storage }).array("file", 3);

// Accessible to All Users:
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").patch(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

// Logged-In User Accessible:
router.use(protect);
router.route("/logout").get(logout);
router.route("/updatemypassword").patch(updatePassword);
router.route("/updateme").patch(upload, updateMe);
router.route("/deleteme").delete(deleteMe);
router.route("/me").get(getMe);

// Admin Accessible:
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/upload").post(upload, uploadImage);
router.route("/uploadMany").post(uploadMany, uploadManyImage);

export default router;
