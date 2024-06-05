import { user } from "../model/user.js";
import jwt from "jsonwebtoken";
import bcypt from "bcrypt";
import { product } from "../model/product.js";
import nodemailer from "nodemailer";

// Register
export const register = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const isUser = await user.findOne({ username });

        if (isUser) return res.status(409).json({
            success: false,
            message: "User already Exits !!!"
        });

        // hasing Password
        const pass = await bcypt.hash(password, 10);


        const User = await user.create({
            name,
            username,
            password: pass
        });


        const userToken = jwt.sign({ _id: User._id }, process.env.JWT_URI);
        // console.log(token);

        res.status(200).cookie("userToken", userToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,

        }).json({
            success: true,
            message: "Registerd !!!"
        });

    } catch (error) {
        res.status(400).json({
            success: true,
            message: error
        });
    }

};


// Login
export const login = async (req, res) => {
    const { username, password } = req.body;


    try {
        const User = await user.findOne({ username }).select('+password');

        if (!User) return res.status(400).json({
            success: false,
            message: "Incorrect user or password !"
        });

        const hasedPass = await bcypt.compare(password, User.password);


        if (!hasedPass) return res.status(400).json({
            success: false,
            message: "Incorrect user or Password !"
        });

        const userToken = jwt.sign({ _id: User._id }, process.env.JWT_URI);
        // console.log(token);

        res.status(200).cookie("userToken", userToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        }).json({
            success: true,
            message: `Welcome Back ${User.name}`
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            message: error
        });
    }


};


// Logout
export const logout = (req, res) => {

    try {
        res.status(200).cookie("userToken", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({
            success: true,
            message: "Logout"
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            message: error
        });
    }

};


export const getUser = (req, res) => {

    try {

        res.status(200).json({
            success: true,
            data: req.userData
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error
        });

    }
};


export const updateUserData = async (req, res) => {

    try {
        const { name, phoneNo, alternatePNo, address, secondAddress, landMark, city, state, country } = req.body;

        const userId = req.userData._id;

        await user.findByIdAndUpdate({ _id: userId }, { $set: { name, phoneNo, alternatePNo, address, secondAddress, landMark, city, state, country } });

        res.status(200).json({
            success: true,
            message: 'Update'
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const AddProductinWishlist = async (req, res) => {
    try {

        const { id } = req.params;

        const isProduct = await product.findById({ _id: id });

        if (!isProduct) return res.status(404).json({
            success: false,
            message: "Not Found !!!"
        });

        const userData = req.userData;
        const isExits = userData.wishlist;

        if (isExits.includes(id)) return res.status(403).json({
            success: false,
            message: "Already Exits !!!"
        });

        await user.findByIdAndUpdate({ _id: userData._id }, { $push: { wishlist: id } });

        res.status(200).json({
            success: true,
            message: "Add",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error !!!",
            error
        });
    }
};

export const removeProductWishlist = async (req, res) => {

    try {
        const { id } = req.params;

        const userData = req.userData;

        await user.findByIdAndUpdate({ _id: userData._id }, { $pull: { wishlist: id } });

        res.status(200).json({
            success: true,
            message: "Removed ",
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error !!!",
            error
        });
    }
};


export const getWishlistProduct = async (req, res) => {

    try {
        const userData = req.userData;
        const wishlistArray = [];

        await Promise.all(

            userData.wishlist.map(async (i) => {

                const getProudct = await product.findById({ _id: i });

                wishlistArray.push(getProudct);
            })
        );


        res.status(200).json({
            success: true,
            wishlistArray
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error
        });

    }
};



export const isProductinWishlist = async (req, res) => {

    try {

        const { id } = req.params;

        // console.log(id);
        const wishlistArray = req.userData.wishlist;

        const isExits = wishlistArray.includes(id);

        res.status(200).json({
            success: true,
            message: isExits

        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error
        });

    }
};



export const addCart = async (req, res) => {

    try {

        const { id } = req.params;

        let { qty } = req.body;

        if (!qty) qty = 1;

        const isProduct = await product.findById({ _id: id });


        if (!isProduct) return res.status(404).json({
            success: false,
            message: "Proudct not found !!!"
        });

        const userData = req.userData._id;

        const isExists = await user.findOne({ cart: { $elemMatch: { id } } });

        if (isExists) return res.status(403).json({
            success: false,
            message: "Already Exits !!!"
        });

        await user.findByIdAndUpdate({ _id: userData }, {
            $push: {
                cart: {
                    id,
                    qty
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Add"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error !!!",
            error: error.message
        });

    }

};


export const removeCart = async (req, res) => {

    const { id } = req.params;

    const isProduct = await product.findById({ _id: id });

    if (!isProduct) return res.status(404).json({
        success: false,
        message: "Proudct not Exits !!! "
    });

    const userData = req.userData;

    await user.findByIdAndUpdate({ _id: userData._id }, { $pull: { cart: { id } } });


    res.status(200).json({
        success: true,
        message: "Remove"
    });
};


export const getUserCart = async (req, res) => {

    try {
        const userData = req.userData.cart;
        const wishlist = req.userData.wishlist;

        let cartArray = [];

        await Promise.all(
            userData.map(async (i) => {
                // console.log(i.id);

                const Proudct = await product.findById({ _id: i.id });

                const isInclude = wishlist.includes(i.id);


                const productDetails = {
                    _id: Proudct._id,
                    pNo: Proudct.pNo,
                    name: Proudct.name,
                    desc: Proudct.desc,
                    price: Proudct.price,
                    qty: i.qty,
                    img: Proudct.images,
                    isInclude
                };


                cartArray.push(productDetails);

            })
        );

        res.status(200).json({
            success: true,
            cartArray
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error : ",
            error: error.message
        });

    }


};



export const contactUsData = async (req, res) => {

    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'abdiel.ruecker@ethereal.email',
                pass: 'HwPj2YrsGeccWUcxmv'
            }
        });

        const info = await transporter.sendMail({
            from: 'arbaazhasan.ah@gmail.com',
            to: 'arbaazhasan.azh@gmail.com',
            subject: 'Test',
            text: "Text Email "
        });


        console.log(info.messageId);


        res.status(200).json({
            success: true,
            message: info.messageId
        });



    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error !!!",
            error
        });


    }
};