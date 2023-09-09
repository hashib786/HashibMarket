import { Router } from "express";
import { getSeller } from "../controller/sellerController";

const router = Router();

// Accessible to All Users:
router.route("/:sellerId").get(getSeller);

export default router;
