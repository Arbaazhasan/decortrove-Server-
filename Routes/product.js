import express from "express";
import { addPopularProduct, addBanner, deleteProduct, deleteSlider, getAllProducts, getArrivalProductCategory, getArrivalProducts, getProduct, getSliderSlide, newArrivals, newProduct, slider, updateArrivalCategory, updateProduct, getBanners, getPopularProudct, getAllCategoryProducts, getProudctByName } from "../Controller/product.js";
import { adminIsAuthonticated, isAuthonticated } from "../middleware/auth.js";
import fileUpload from "../middleware/multer.js";


const router = express.Router();


// ********* Dashboard API *********

// Add, Delete, Update, Search Products 
router.post('/new', adminIsAuthonticated, fileUpload, newProduct);
router.post('/update/:pno', adminIsAuthonticated, fileUpload, updateProduct);
router.get('/delete/:pno', adminIsAuthonticated, deleteProduct);
router.get('/getallproducts', getAllProducts);
router.get('/getproduct', getProduct);

router.get('/getallcategoryproducts', getAllCategoryProducts);
router.get('/getproductbyname/:name', getProudctByName);


router.post('/addpopularproduct', adminIsAuthonticated, addPopularProduct);
router.get('/getpopularproduct', getPopularProudct);

router.post('/addarrival/:sno', adminIsAuthonticated, newArrivals);
router.put('/updatearrivalcategory', adminIsAuthonticated, updateArrivalCategory);
router.get('/getArrivalproductcategory', getArrivalProductCategory);
router.get('/getarrivalproducts/:category', getArrivalProducts);


router.get('/getsliderslide', getSliderSlide);
router.post('/addslider', fileUpload, slider);
router.delete('/deleteslider/:slideno', deleteSlider);


router.post('/addbanner', fileUpload, addBanner);
router.get('/getbanners', getBanners);



export default router;