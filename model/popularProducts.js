import mongoose from "mongoose";

const popularProductSchema = mongoose.Schema({
    tabNo: {
        type: Number
    },

    pNo: {
        type: String
    }
});

export const popularProductModel = new mongoose.model("Popular Product", popularProductSchema);