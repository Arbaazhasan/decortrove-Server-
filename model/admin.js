import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
        select: false
    }
});


export const admin = mongoose.model("admin", adminSchema);