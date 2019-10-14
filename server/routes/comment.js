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

async function getLastComments (req, res) {
    const count = req.query.size;
    await Comment.find({})
        .then(result => res.json(result.reverse().filter(uniqueIdOfProduct).slice(0, count)))
        .catch(error => res.status(500).json(error))
}

function uniqueIdOfProduct(value, index, self) {
    for(let i = 0; i<index; i++){
        if(value.idOfProduct === self[i].idOfProduct) return false;
    }
    return true;
}

module.exports = {
    add,
    getAllById,
    getLastComments
};