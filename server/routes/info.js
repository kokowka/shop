const Info = require('../models/info');

async function create (req, res){
    await Info.create(req.body)
        .then(result => res.json(result))
        .catch(error => {console.log(error); res.status(500).json(error)});
}

async function getByType(req, res) {
    const type = req.query.type;
    await Info.find({type: type})
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));

}

module.exports = {
    create,
    getByType
};