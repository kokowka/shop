const User = require('../models/users');
const bcrypt = require('bcrypt');

async function register (req, res){
    await User.create(req.body).then(result => res.json(result))
        .catch(error => res.status(500).json({error: error.message}));
}


async function logIn(req, res) {
    await User.findOne({email: req.body.email}).then(user =>{
        bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
            if(isMatch) res.json(user);
            else res.status(500).json({error: "The credential is wrong!"});
        });
    }).catch(error => res.status(500).json({error: error.message}));
}

async function isAdmin(req, res){
    await User.findOne({
        email: req.body.email,
        fullName: req.body.fullName
    }).then(user=> res.json({isAdmin: user && user.role === 'admin'}))
        .catch(error => res.status(500).json({error: error.message}));
}

module.exports = {
    register,
    logIn,
    isAdmin
};