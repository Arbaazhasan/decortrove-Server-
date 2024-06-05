import { CompleteOrder } from "../model/completeOrder.js";
import { Order } from "../model/order.js";
import { product } from "../model/product.js";

export const getAllNewOrders = async (req, res) => {


    const orders = await Order.find();


    res.status(200).json({
        success: true,
        orders
    });
};


export const orderStatusUpdate = async (req, res) => {

    try {
        const { _id, status } = req.body;

        if (status === "Delivered") {

            let getOrder = await Order.findByIdAndUpdate(_id, { status });

            if (!getOrder)
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            getOrder = await Order.findById({ _id });

            const isDelivered = await CompleteOrder.create({
                orderId: getOrder.orderId,
                userId: getOrder.userId,
                pId: getOrder.pId,
                pNo: getOrder.pNo,
                pName: getOrder.pName,
                price: getOrder.price,
                status: getOrder.status,
                shippingDetails: getOrder.shippingDetails,
                trackingId: getOrder.trackingId,
                orderType: getOrder.orderType,
            });

            if (isDelivered) {
                await Order.findByIdAndDelete({ _id });
            }

            return res.status(200).json({
                success: true,
                message: "Order Delivered"
            });

        }


        await Order.findByIdAndUpdate(_id, { status });

        res.status(200).json({
            success: true,
            message: 'Status Update'
        });


    } catch (error) {

        res.status(500).json({
            success: true,
            message: 'Internal Server Error !!!',
            error: error.message
        });

    }

};



export const orderTrackingIdUpdate = async (req, res) => {

    try {
        const { _id, trackingId } = req.body;


        await Order.findByIdAndUpdate(_id, { trackingId });

        res.status(200).json({
            success: true,
            message: 'TrackingId Update'
        });

    } catch (error) {

        res.status(500).json({
            success: true,
            message: 'Internal Server Error !!!',
            error: error.message
        });


    }

};


export const getDeliveredOrders = async (req, res) => {

    const deliveredOrders = await CompleteOrder.find();

    res.status(200).json({
        success: true,
        deliveredOrders

    });
};


export const removeDeliveredOrder = async (req, res) => {
    try {



        const getOrder = await CompleteOrder.findById({ _id: req.body._id });

        if (!getOrder)
            return res.status(404).json({
                success: false,
                message: "Order not FOund !!!"
            });

        const { _id, ...orderWithout_id } = getOrder;

        const isOrder = await Order.create({
            orderId: getOrder.orderId,
            userId: getOrder.userId,
            pId: getOrder.pId,
            pNo: getOrder.pNo,
            pName: getOrder.pName,
            price: getOrder.price,
            status: getOrder.status,
            shippingDetails: getOrder.shippingDetails,
            trackingId: getOrder.trackingId,
            orderType: getOrder.orderType,
        });

        if (isOrder)
            await CompleteOrder.findByIdAndDelete({ _id: req.body._id });


        res.status(200).json({
            success: true,
            message: "Order Removed"
        });


    } catch (error) {

        res.status(500).json({
            success: true,
            message: "Internal Server Error !!!",
            error: error.message
        });


    }

};





// User Order APIS 
export const getUserAllOrders = async (req, res) => {

    const userId = req.userData._id;

    let getOrders = await Order.find({ userId });

    const orderProducts = [];

    await Promise.all(
        getOrders.map(async (i) => {

            let productDetails = {};
            let orderProductsArray = [];

            await Promise.all(
                i.pId.map(async (pId) => {
                    const getProduct = await product.findById({ _id: pId });

                    orderProductsArray.push({
                        _id: getProduct._id,
                        name: getProduct.name,
                        desc: getProduct.desc,
                        price: getProduct.price,
                        images: getProduct.images[0],
                    });
                })
            );

            productDetails = {
                ...i.toObject(),
                pId: orderProductsArray
            };

            orderProducts.push(productDetails);
        })
    );

    getOrders = await CompleteOrder.find({ userId });

    await Promise.all(
        getOrders.map(async (i) => {

            let productDetails = {};
            let orderProductsArray = [];

            await Promise.all(
                i.pId.map(async (pId) => {
                    const getProduct = await product.findById({ _id: pId });

                    orderProductsArray.push({
                        _id: getProduct._id,
                        name: getProduct.name,
                        desc: getProduct.desc,
                        price: getProduct.price,
                        images: getProduct.images[0],
                    });
                })
            );

            productDetails = {
                ...i.toObject(),
                pId: orderProductsArray
            };

            orderProducts.push(productDetails);
        })
    );

    res.status(200).json({
        success: true,
        orderProducts

    });
};



export const cancerOrder = async (req, res) => {
    try {
        const { _id } = req.body;

        let getOrder = await Order.findById({ _id });

        if (!getOrder) return res.status(200).json({
            success: false,
            message: "Order not Found !!!",
        });

        await Order.findByIdAndUpdate({ _id }, { status: "Canceled" });

        getOrder = await Order.findById({ _id });


        const isOrder = await CompleteOrder.create({
            orderId: getOrder.orderId,
            userId: getOrder.userId,
            pId: getOrder.pId,
            pNo: getOrder.pNo,
            pName: getOrder.pName,
            price: getOrder.price,
            status: getOrder.status,
            shippingDetails: getOrder.shippingDetails,
            trackingId: getOrder.trackingId,
            orderType: getOrder.orderType,
        });

        if (isOrder)
            await Order.findByIdAndDelete({ _id });



        res.status(200).json({
            success: true,
            message: "Order Canceled",

        });

    } catch (error) {

        res.status(200).json({
            success: true,
            message: "Internal Server Error !!!",
            error: error.message
        });

    }

};