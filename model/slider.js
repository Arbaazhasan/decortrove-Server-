import mongoose from "mongoose";

const slider = mongoose.Schema({

    slideNo: {
        type: Number,
        require: true,
        unique: true
    }
    ,
    slideImage: {
        type: [],
    },

    slideText: {
        type: String,
    }

});


export const sliderModel = new mongoose.model("Slider", slider);