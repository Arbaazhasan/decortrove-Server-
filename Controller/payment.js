import { instance } from "../app.js";
import crypto from "crypto";
import { Payment } from "../model/payment.js";
import { Order } from "../model/order.js";

let isPayment = false;
let orderDetails = {};

export const checkout = async (req, res) => {

    const options = {
        amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order
    });
};


export const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;


    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.Razorpay_Key_Secret)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {

        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature

        });

        res.redirect(
            `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
        );

        await Order.create({
            orderId: razorpay_order_id,
            userId: orderDetails.userId,
            pId: orderDetails.pId,
            pNo: orderDetails.pNo,
            pName: orderDetails.pName,
            price: orderDetails.price,
            status: orderDetails.status,
            shippingDetails: orderDetails.shippingDetails,
            trackingId: orderDetails.trackingId,
            orderType: "PAID",
        });
    }
    else {
        res.status(400).json({
            success: false,
        });
    }

};


export const razorpay_API_Key = (req, res) => {
    res.status(200).json({
        success: true,
        key: process.env.Razorpay_Key_Id
    });
};


export const getOrderDetails = async (req, res) => {

    const {
        _id,
        userName,
        phoneNo1,
        phoneNo2,
        userAddress,
        landMark,
        city,
        state,
        country,
        productArray
    } = req.body;

    const shippingDetails = { userName, phoneNo1, phoneNo2, userAddress, landMark, city, state, country };

    let pId = [], pNo = "", pName = "", price = null;

    productArray.map((item) => {
        pId.push(item._id);
        pNo += item.pNo + ", ";
        pName += item.name + ", ";
        price += item.price;
    });

    orderDetails = {
        orderId: isPayment,
        userId: _id,
        pId: pId,
        pName: pName,
        pNo: pNo,
        price: price,
        status: "order Confirmed",
        shippingDetails: shippingDetails,
        trackingId: "In process"
    };


};



export const CODOrder = async (req, res) => {

    try {

        const COdOrderId = Math.round(Math.random() * 100) * Date.now();

        const order = {
            ...orderDetails,
            orderId: COdOrderId,
            orderType: "COD"
        };

        await Order.create(order);

        res.status(200).json({
            success: true,
            message: "Order Complete"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error !!!",
            error: error.message
        });


    }

}

