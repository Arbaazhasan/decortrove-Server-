import mongoose from "mongoose";

const completeOrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    pId: {
        type: [],
        required: true,
    },
    pNo: {
        type: String,
        required: true
    },
    pName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    shippingDetails: {
        type: {},
        required: true,
    },
    trackingId: {
        type: String,
        required: true,
    },
    orderType: {
        type: String,
        required: true
    }
});

export const CompleteOrder = mongoose.model("Complete Order", completeOrderSchema);
