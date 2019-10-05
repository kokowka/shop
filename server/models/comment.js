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
});

module.exports = mongoose.model('Comment', CommentSchema);
