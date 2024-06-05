import express from "express";
import { CODOrder, checkout, paymentVerification, razorpay_API_Key } from "../Controller/payment.js";

const router = express.Router();

router.post("/checkout", checkout);

router.post("/paymentverification", paymentVerification);
router.post("/codorder", CODOrder);

router.get('/getkey', razorpay_API_Key);

export default router;