const Blog = require('../models/blog');

async function create (req, res){
    await Blog.create(req.body)
        .then(result => res.json(result))
        .catch(error => {console.log(error); res.status(500).json(error)});
}

async function get(req, res) {
    await Blog.find({})
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
}

async function getById(req, res) {
    await Blog.find({_id: req.query.id})
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
}

module.exports = {
    create,
    get,
    getById
};