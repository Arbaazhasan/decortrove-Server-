import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    pNo: {
        type: String,
        require: true,
    },
    name: {
        type: String,
    },
    desc: {
        type: String
    },
    price: {
        type: Number,
        require: true

    },
    color: {
        type: String
    },
    category: {
        type: String,
        require: true
    },
    available: {
        type: String,

    },
    images: {
        type: []
    }
});

export const product = mongoose.model("product", productSchema);