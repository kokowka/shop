'use strict';

const mongoose = require("mongoose");

const GoodSchema = new mongoose.Schema({
    name: String,
    colors: Array,
    category: String,
    'description-en': String,
    'description-ru': String,
    'description-ua': String,
    price: mongoose.SchemaTypes.Decimal128,
    rating: Array,
    brand: String,
    rate: {
        type: mongoose.SchemaTypes.Decimal128,
        default: 0
    },
    imgs: Array,
    isNewGood: {
        type: Boolean,
        default: true
    },
    discount: {
        type: Number,
        default: 0
    },
    isSuperPropose: {
        type: Boolean,
        default: false
    },
    timerOfPropose: {
        type: Number,
        default: 0
    },
    available: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    'characteristics-en': Object,
    'characteristics-ru': Object,
    'characteristics-ua': Object,
    subcategory: String
}, {toJSON: {getters: true}, timestamps: true, minimize: false});

module.exports = mongoose.model('Good', GoodSchema);
