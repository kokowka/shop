'use strict';

const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    'text-ru': String,
    'text-ua': String,
    'title-ru': String,
    'title-ua': String,
    img: String
}, {toJSON: {getters: true}, timestamps: true, minimize: false});

module.exports = mongoose.model('Blog', BlogSchema);
