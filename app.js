import express from "express";
import dotenv from "dotenv";
import dbConnection from "./data/databaseConnection.js";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import adminRouter from './Routes/admin.js';
import paymentRouter from './Routes/paymentsRoutes.js';
import orderDetailsRouter from './Routes/order.js';

import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import { v2 as cloudinary } from 'cloudinary';
import Razorpay from "razorpay";



// DotEnv Configuration
dotenv.config({
    path: './data/config.env'
});


// Database Connectivity 
dbConnection(process.env.DB_CONNECTION);


// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


// Configure for cros Origin 
app.use(cors({
    origin: process.env.CORS_ORIGIN_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"]
}));


// Routes
app.use('/api/v1/user/', userRouter);
app.use('/api/v1/product/', productRouter);
app.use('/api/v1/admin/', adminRouter);
app.use('/api/v1/order/', orderDetailsRouter);
app.use('/api/v1/paymets/', paymentRouter);


app.get('/', (req, res) => {
    res.send("Working fine sir");
});


// Cloudinary Configrination

cloudinary.config({
    cloud_name: process.env.Cloudinary_cloud_name,
    api_key: process.env.Cloudinary_api_key,
    api_secret: process.env.Cloudinary_api_secret
});


// cloudinary.config({
//     cloud_name: "ddixq9qyw",
//     api_key: "457974513769685",
//     api_secret: "vtXUFQ4XPDtF7xYlCASYgIolvtE"
// });

// Razorpay Instance

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key_Id,
    key_secret: process.env.Razorpay_Key_Secret,
});


// Server
app.listen(process.env.PORT, (req, res) => {
    console.log(`server is Working on : \n${process.env.HOST + process.env.PORT}`);
});