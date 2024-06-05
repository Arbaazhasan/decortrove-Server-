import express from "express";
import { AddProductinWishlist, addCart, contactUsData, getUser, getUserCart, getWishlistProduct, isProductinWishlist, login, logout, register, removeCart, removeProductWishlist, updateUserData } from "../Controller/user.js";
import { isAuthonticated } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/updateuserdata', isAuthonticated, updateUserData);

router.post('/getuser', isAuthonticated, getUser);

router.post('/addproductwishlist/:id', isAuthonticated, AddProductinWishlist);
router.post('/removeproductwishlist/:id', isAuthonticated, removeProductWishlist);
router.post('/getwishlistproducts', isAuthonticated, getWishlistProduct);
router.post('/isproductwishlist/:id', isAuthonticated, isProductinWishlist);
router.post('/addproductcart/:id', isAuthonticated, addCart);
router.post('/removeproductcart/:id', isAuthonticated, removeCart);
router.post('/getusercart', isAuthonticated, getUserCart);
router.post('/contactusdata', contactUsData);


export default router;
