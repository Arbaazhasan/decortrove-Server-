import multer from "multer";
import { product } from "../model/product.js";
import { sliderModel } from "../model/slider.js";
import { bannerModel } from "../model/banner.js";
import { newArrivalsModel } from "../model/newArrivals.js";
import { popularProductModel } from "../model/popularProducts.js";
// import { uploadOncloudinary } from "../middleware/postUpload.js";
import { uploadOncloudinary } from "../utils/dataUri.js";
import { v2 as cloudinary } from 'cloudinary';

import path from "path";
import { resolveSoa } from "dns";







// *********** Product Content **********


// New Product
export const newProduct = async (req, res) => {

    try {
        const { pNo, name, desc, price, size, color, category, available, images } = req.body;

        const files = req.files;
        const getUriArray = [];


        const isProduct = await product.findOne({ pNo: pNo });

        if (isProduct) return res.status(403).json({
            success: true,
            message: "Product Already Exits !!!"
        });

        // Use Promise.all to wait for all uploads

        await Promise.all(files.map(async (file) => {

            try {
                const getUri = uploadOncloudinary(file);
                const response = await cloudinary.uploader.upload(getUri.content);

                getUriArray.push({
                    url: response.url,
                    public_id: response.public_id
                });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }));

        console.log("getUriArray : ", getUriArray);


        const Product = await product.create({
            pNo, name, desc, price, size, color, category, available,
            images: getUriArray,
        });
        res.status(201).json({
            success: true,
            message: "Product Uploaded"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }


};


// Update Product 


export const updateProduct = async (req, res) => {
    try {
        const find = req.params.pno;
        console.log(find);

        const {
            pNo,
            name,
            desc,
            price,
            color,
            category,
            available,
            imageArray,
            deleteImages
        } = req.body;

        const isProduct = await product.findOne({ pNo: find });

        if (!isProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        console.log(deleteImages);

        if (deleteImages) {

            if (deleteImages.length === 0) {
                await Promise.all(deleteImages.map(async (i) => {
                    try {
                        cloudinary.uploader.destroy(i, (error, result) => {
                            if (error) return console.error('Error deleting file:', error);
                        });

                    } catch (error) {
                        console.error('Error deleting file:', error);
                    }
                }));
            } else {
                try {
                    cloudinary.uploader.destroy(deleteImages, (error, result) => {
                        if (error) return console.error('Error deleting file:', error);
                    });

                } catch (error) {
                    console.error('Error deleting file:', error);
                }

            }
        }


        const files = req.files;
        const getUriArray = [];

        if (files.length > 0) {
            await Promise.all(files.map(async (file) => {
                try {
                    const getUri = uploadOncloudinary(file);
                    const response = await cloudinary.uploader.upload(getUri.content);

                    getUriArray.push({
                        url: response.url,
                        public_id: response.public_id
                    });
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }));
        }



        const updateImagesArray = imageArray ? imageArray.map(JSON.parse) : [];

        // Combine newImagesArray and uploaded images
        const finalImagesArray = getUriArray ? updateImagesArray.concat(getUriArray) : updateImagesArray;



        const updateFields = {
            ...(pNo && { pNo }),
            ...(name && { name }),
            ...(desc && { desc }),
            ...(price && { price }),
            ...(color && { color }),
            ...(category && { category }),
            ...(available && { available }),
            ...(finalImagesArray && { images: finalImagesArray })
        };

        await product.updateOne({ pNo: find }, updateFields);

        res.status(200).json({
            success: true,
            message: "Update"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};




// Delete Product

export const deleteProduct = async (req, res) => {
    try {
        const pNo = req.params.pno;

        // console.log(pNo);

        const isProduct = await product.findById({ _id: pNo });

        if (!isProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not Found !!!"
            });
        }

        // console.log(isProduct.images);

        await Promise.all(isProduct.images.map(async (pId) => {
            try {
                cloudinary.uploader.destroy(pId.public_id, (error, result) => {
                    if (error) return console.error('Error deleting file:', error);
                });

            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }));

        await newArrivalsModel.deleteOne({ pNo: isProduct.pNo });
        await popularProductModel.deleteOne({ pNo: isProduct.pNo });

        await product.deleteOne({ _id: pNo });


        res.status(200).json({
            success: true,
            message: "Delete"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
        console.log(error.message);
    }
};

// Get All Products 
export const getAllProducts = async (req, res) => {

    try {
        const allProducts = await product.find();

        res.status(200).json({
            success: true,
            allProducts: allProducts
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            message: error
        });
    }
};


// Get Product
export const getProduct = async (req, res) => {

    try {

        const find = req.query;

        // console.log(find);


        const Product = find.pNo ?
            await product.findOne({ pNo: find.pNo })
            :
            await product.findById({ _id: find.pId });

        if (!Product) return res.status(404).json({
            success: false,
            Product: "Product not Found !!!"
        });

        res.status(200).json({
            success: true,
            Product
        });
    } catch (error) {

        res.status(400).json({
            success: false,
            Product: error,
        });
    }
};



// ********* Page Content *********


// Slider

export const slider = async (req, res) => {


    try {

        const { slideNo, slideText } = req.body;

        const file = req.files;

        const getUri = uploadOncloudinary(file[0]);

        const response = await cloudinary.uploader.upload(getUri.content);

        const imageObj = {
            url: response.url,
            public_id: response.public_id
        };


        const isSlider = await sliderModel.findOne({ slideNo: slideNo });

        if (!isSlider) {
            await sliderModel.create({
                slideNo, slideImage: imageObj, slideText
            });
            return res.status(201).json({
                success: true,
                message: "Created"
            });
        }


        const public_id = await isSlider.slideImage[0].public_id;

        // Deleteing old Image from server 
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) return console.error('Error deleting file:', error);
        });

        await sliderModel.updateOne({ slideNo }, { slideImage: imageObj, slideText });

        res.status(200).json({
            success: true,
            message: "Update"
        });


    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

        console.log(error.message);

    }

};



// Delete Slider

export const deleteSlider = async (req, res) => {

    const { slideno } = req.params;


    const isSlider = await sliderModel.findOne({ slideNo: slideno });

    if (!isSlider) return res.status(404).json({
        success: false,
        message: "Slide not Exists !!!"
    });


    const public_id = await isSlider.slideImage[0].public_id;

    // Deleteing old Image from server 
    cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) return console.error('Error deleting file:', error);
    });


    await sliderModel.deleteOne({ slideNo: slideno });

    res.status(200).json({
        success: true,
        message: "Delete"
    });


};


// Get Slider SLide

export const getSliderSlide = async (req, res) => {
    const data = await sliderModel.find();


    res.status(200).json({
        success: true,
        message: data
    });
};


// Banner 
export const addBanner = async (req, res) => {

    try {

        const { bNo, bannerText } = req.body;

        const file = await req.files;

        const getUri = uploadOncloudinary(file[0]);

        const response = await cloudinary.uploader.upload(getUri.content);

        const imageObj = {
            url: response.url,
            public_id: response.public_id
        };


        const isBanner = await bannerModel.findOne({ bNo });

        if (!isBanner) {
            await bannerModel.create({
                bNo, bannerText, image: imageObj
            });

            return res.status(200).json({
                success: true,
                message: "Successfully Upload"
            });
        }


        const public_id = await isBanner.image.public_id;

        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) return console.error('Error deleting file:', error);
        });

        await bannerModel.findOneAndUpdate({ bNo }, { $set: { bannerText, image: imageObj } });

        res.status(200).json({
            success: true,
            message: "Upload"
        });

    } catch (error) {

        res.status(200).json({
            success: true,
            message: "Internal Server Error !!!",
            error: error.message
        });

        console.log(error.message);

    }

};


export const getBanners = async (req, res) => {

    const banners = await bannerModel.find();

    res.status(200).json({
        success: true,
        data: banners
    });
};


export const newArrivals = async (req, res) => {

    try {
        const { tabNo, pNo } = req.body;


        const isProduct = await product.findOne({ pNo });

        if (!isProduct) return res.status(404).json({
            success: false,
            message: "Product not Exits !!!"
        });


        const isExits = await newArrivalsModel.findOne({
            $and: [
                { pNo: pNo },
                { category: isProduct.category }
            ]
        });

        if (isExits) return res.status(409).json({
            success: false,
            message: "Product already Exits !!!",
        });

        // console.log("tabNo : ", tabNo, "pNo :", pNo);

        const isTab = await newArrivalsModel.findOne({
            $and: [
                { tabNo: tabNo },
                { category: isProduct.category }
            ]
        });


        if (!isTab) {

            await newArrivalsModel.create({ tabNo, category: isProduct.category, pNo });

            return res.status(200).json({
                success: true,
                message: "Added Successfully"
            });
        }

        await newArrivalsModel.findOneAndUpdate({ tabNo, category }, { $set: { pNo, category: isProduct.category } });

        res.status(200).json({
            success: true,
            message: "Add Successfull"
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


export const updateArrivalCategory = async (req, res) => {
    const { oldCat, newCat } = req.body;

    await newArrivalsModel.updateMany({ category: oldCat }, {
        category: newCat
    });

    res.status(200).json({
        success: true,
        message: "Update Category"
    });
};

export const getArrivalProducts = async (req, res) => {
    // const { category } = req.body;
    const { category } = req.params;


    const data = await newArrivalsModel.find({ category });

    if (!data) return res.status(404).json({
        success: false,
        message: "Proudct Not Found !!!"
    });

    const productArray = [];

    await Promise.all(

        data.map(async (i) => {

            const getProduct = await product.findOne({ pNo: i.pNo });

            if (!getProduct) console.log("Not found!!!");

            productArray.push(getProduct);

        })
    );


    // console.log(productArray);

    res.status(200).json({
        success: true,
        message: productArray
    });
};

export const getArrivalProductCategory = async (req, res) => {

    const data = await newArrivalsModel.find();
    const categoryArray = [];

    for (let i = 0; i < data.length; i++) {
        const currentCategory = data[i].category;

        if (!categoryArray.includes(currentCategory)) {
            categoryArray.push(currentCategory);
        }
    }


    res.status(200).json({

        success: true,
        category: categoryArray
    });

};


// *******Popular Product *********
export const addPopularProduct = async (req, res) => {


    try {

        const { tabNo, pNo } = req.body;

        const isProduct = await product.findOne({ pNo });

        if (!isProduct) return res.status(404).json({
            success: false,
            message: "Product not Exits !!!",
        });

        const isExits = await popularProductModel.findOne({ pNo });

        if (isExits) return res.status(409).json({
            success: false,
            message: "Product Exits !!!"
        });


        const isTab = await popularProductModel.findOne({ tabNo });

        if (!isTab) {
            await popularProductModel.create({ tabNo, pNo });

            return res.status(200).json({
                success: true,
                message: "Added Successfully"
            });
        }

        await popularProductModel.findOneAndUpdate({ tabNo }, { $set: { pNo: pNo } });

        res.status(200).json({
            success: true,
            message: "Add Successfull"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error
        });

    }

};


export const getPopularProudct = async (req, res) => {

    const data = await popularProductModel.find();

    const productArray = [];

    await Promise.all(
        data.map(async (i) => {

            const getProduct = await product.findOne({ pNo: i.pNo });

            if (!getProduct) return;

            productArray.push(getProduct);

        })
    );

    res.status(200).json({
        success: true,
        data: productArray
    });
};


export const getAllCategoryProducts = async (req, res) => {

    const data = await product.find();
    const categoryArray = [];
    const ProudctArray = [];


    data.map((i, index) => {

        // console.log(i.category);

        if (!categoryArray.includes(i.category))
            categoryArray.push(i.category);

    });


    categoryArray.map((i) => {

        const temp = [];
        data.map((j) => {
            if (i === j.category)
                temp.push({ pNo: j.pNo, name: j.name });
        });

        ProudctArray.push({ Category: i, pNo: temp });
    });


    res.status(200).json({
        success: true,
        ProudctArray
    });


};

export const getProudctByName = async (req, res) => {

    try {
        const find = req.params.name;

        const getProduct = await product.find({
            $or: [
                { name: { $regex: find, $options: 'i' } },
                { category: { $regex: find, $options: 'i' } }
            ]
        });


        res.status(200).json({
            success: true,
            find,
            message: getProduct
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error !!!" + error

        });

    }
};