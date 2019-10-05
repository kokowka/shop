const Banner = require('../models/banner');

async function create (req, res){
    await Banner.create(req.body)
        .then(result => res.json(result))
        .catch(error => {console.log(error); res.status(500).json(error)});
}

async function getByType(req, res) {
    const type = req.query.type;
    await Banner.find({type: type})
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));

}

module.exports = {
    create,
    getByType
};