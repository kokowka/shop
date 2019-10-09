'use strict';

const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
    'text-en': String,
    'text-ru': String,
    'text-ua': String,
    'title-en': String,
    'title-ru': String,
    'title-ua': String,
    type: String,
    idOfProduct: String
}, {toJSON: {getters: true}, timestamps: true, minimize: false});

module.exports = mongoose.model('Info', InfoSchema);
