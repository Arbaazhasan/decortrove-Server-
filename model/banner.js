import mongoose from "mongoose";

const BannerModel = mongoose.Schema({

    bNo: {
        type: String,
    },

    image: {
        type: {}
    },

    bannerText: {
        type: String,
    }

});

export const bannerModel = new mongoose.model("banner", BannerModel);