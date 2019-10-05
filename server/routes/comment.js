const Comment = require('../models/comment');

async function add (req, res){
    await Comment.create(req.body)
        .then(result => res.json(result))
        .catch(error => {console.log(error); res.status(500).json(error)});
}

async function getAllById(req, res) {
    await Comment.find({idOfProduct: req.query.id})
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
}

module.exports = {
  add,
  getAllById
};