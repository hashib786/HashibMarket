import { Router } from "express";
import { forgotPassword, login, signUp } from "../controller/authController";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").patch(forgotPassword);

export default router;
