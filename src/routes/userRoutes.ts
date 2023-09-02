import { Router } from "express";
import { signUp } from "../controller/authController";

const router = Router();

router.route("/signup").post(signUp);

export default router;
