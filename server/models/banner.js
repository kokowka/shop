'use strict';

const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    'description-ru': String,
    'description-ua': String,
    category: String,
    type: String,
    rating: {
      type: Number,
      default: 5
    },
    name: String,
    img: String,
    idOfProduct: String
}, {toJSON: {getters: true}, timestamps: true, minimize: false});

module.exports = mongoose.model('Banner', BannerSchema);
