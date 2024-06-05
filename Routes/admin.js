import express from "express";

import { adminLogin, adminLogout, getAdmin, registerAdmin } from "../Controller/admin.js";
import { adminIsAuthonticated, isAuthonticated } from "../middleware/auth.js";

const router = express.Router();


router.post("/registeradmin", registerAdmin);
router.post("/adminlogin", adminLogin);
router.post("/adminlogout", adminLogout);
router.get("/getadmin", adminIsAuthonticated, getAdmin);





export default router;