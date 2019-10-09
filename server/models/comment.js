'use strict';

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, ' Full name is required']
    },
    text: {
        type: String,
        required: [true, ' Text is required']
    },
    idOfProduct: {
        type: String,
        required: [true, ' idOfProduct is required']
    }
}, {toJSON: {getters: true}, timestamps: true, minimize: false});

module.exports = mongoose.model('Comment', CommentSchema);
