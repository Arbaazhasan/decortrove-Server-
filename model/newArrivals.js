import mongoose, { mongo } from "mongoose";

const newArrivalsSchema = mongoose.Schema({

    tabNo: {
        type: Number
    },
    category: {
        type: String,
        require: true,
    },

    pNo: {
        type: String
    }
});


export const newArrivalsModel = new mongoose.model("NewArrivals", newArrivalsSchema);
