import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    phoneNo: {
        type: Number
    },
    alternatePNo: {
        type: Number
    },
    address: {
        type: String
    },
    secondAddress: {
        type: String
    },
    landMark: {
        String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    wishlist: {
        type: [],
    },
    cart: {
        type: []
    }
});

export const user = mongoose.model("user", userSchema);