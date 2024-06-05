import jwt from "jsonwebtoken";
import { user } from "../model/user.js";
import { admin } from "../model/admin.js";


export const isAuthonticated = async (req, res, next) => {
    try {
        const { userToken } = req.cookies;

        if (!userToken) {
            return res.status(401).json({
                success: false,
                message: "Login First!",
            });
        }

        const decoded = jwt.verify(userToken, process.env.JWT_URI);


        req.userData = await user.findById(decoded);


        if (!req.userData) {
            return res.status(404).json({
                success: false,
                message: "User not Exits",
            });
        }

        next();

    } catch (error) {
        // Handle errors from jwt.verify (e.g., invalid or expired token)
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};


export const adminIsAuthonticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login First!",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_URI);

        req.adminData = await admin.findById(decoded);

        if (!req.adminData) {
            return res.status(404).json({
                success: false,
                message: "User not Exits",
            });
        }

        next();

    } catch (error) {
        // Handle errors from jwt.verify (e.g., invalid or expired token)
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
