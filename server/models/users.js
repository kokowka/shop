'use strict';

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, ' User full name is required']
    },
    phone: {
        type: String,
        required: [true, ' User phone is required']
    },
    email: {
        required: [true, 'User email is required'],
        type: String,
        lowercase: true
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'User password is required']
    }

});

UserSchema.pre('save', function(next){
    let user = this;

    bcrypt.genSalt(5 , function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);