import jwt from "jsonwebtoken";
import { admin } from "../model/admin.js";
import bcrypt from "bcrypt";

export const registerAdmin = async (req, res) => {

    const { name, username, password } = req.body;

    try {

        const isAdmin = await admin.findOne({ username });

        if (isAdmin) return res.status(409).json({
            success: true,
            message: "User Already Exits !!!"
        });

        // Hashing Password 
        const pass = await bcrypt.hash(password, 10);

        const Admin = await admin.create({
            name, username, password: pass
        });


        const token = jwt.sign({ _id: Admin._id }, process.env.JWT_URI);

        res.status(200).cookie("token", token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        }).json({
            success: true,
            message: "Registerd !!!",

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



export const adminLogin = async (req, res) => {

    const { username, password } = req.body;

    try {
        const isUser = await admin.findOne({ username }).select('+password');


        if (!isUser) return res.status(404).json({
            success: false,
            message: "User not Exits !!!"
        });

        const pass = await bcrypt.compare(password, isUser.password);


        if (!pass) return res.status(401).json({
            success: false,
            message: "Incorrect Poassword !!!"
        });


        const token = jwt.sign({ _id: isUser._id }, process.env.JWT_URI);

        res.status(200).cookie("token", token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        }).json({
            status: true,
            message: `Welcome Back ${isUser.name}`,

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const adminLogout = (req, res) => {

    try {

        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({
            success: true,
            message: "Logout "
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const getAdmin = (req, res) => {

    try {

        // console.log(req.userData);

        res.status(200).json({
            success: true,
            userData: req.adminData
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error
        });

    }

};