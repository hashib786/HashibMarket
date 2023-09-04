import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signUp,
} from "../controller/authController";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").patch(forgotPassword);
router.route("/resetpassword/:token").post(resetPassword);

export default router;
