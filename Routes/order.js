import express from "express";
import { getOrderDetails } from "../Controller/payment.js";
import { cancerOrder, getAllNewOrders, getDeliveredOrders, getUserAllOrders, orderStatusUpdate, orderTrackingIdUpdate, removeDeliveredOrder } from "../Controller/Orders.js";
import { adminIsAuthonticated, isAuthonticated } from "../middleware/auth.js";

const router = express.Router();


// User Side API
router.post("/userorderdetails", getOrderDetails);
router.post("/getallorders", isAuthonticated, getUserAllOrders);
router.post("/cancelorder", isAuthonticated, cancerOrder);


// Admin Side API
router.post("/getallneworders", adminIsAuthonticated, getAllNewOrders);
router.post("/updateorderstatus", adminIsAuthonticated, orderStatusUpdate);
router.post("/updateordertrackingid", adminIsAuthonticated, orderTrackingIdUpdate);
router.post("/getdeleiveredorders", adminIsAuthonticated, getDeliveredOrders);
router.post("/removedeleveredorder", adminIsAuthonticated, removeDeliveredOrder);



export default router


