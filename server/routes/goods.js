const Good = require('../models/goods');

async function create (req, res){
    await Good.create(req.body)
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
}


async function getAllGoods(req, res){
    const category = req.query.category;
    const brand = req.query.brand;
    const name = req.query.name;
    let query = {};
    if(category) query = {category: category};
    if (brand) query = {brand: brand};
    if (name) query['name'] = name;
    await Good.find(query)
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
}

async function getById(req, res){
    await Good.findById(req.params.id)
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
}

async function updateRating(req, res){
    await Good.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { rating: req.body.rating  } })
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error))
}

async function updateRate(req, res) {
    await Good.findOneAndUpdate(
        { _id: req.body.id },
        {  rate: req.body.rate  })
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error))
}

async function addTestGoods(req, res) {
    const count = req.body.count;
    const countOfCurrentGoods = req.body.countOfCurrentGoods;

    const categories = [
        "computerAndLaptops",
        "cameras",
        "hardware",
        "phones",
        "tv",
        "gadgets",
        "electronics",
        "consoles",
        "accessories"
    ];

    const currentGoods = await Good.find();

    for(let i = 0; i<count; i++) {
        let discount = 0;
        let randomCategories = Math.floor(Math.floor(Math.random() * 8));
        let randomCurrentGoods = Math.floor(Math.random() * countOfCurrentGoods);
        let isNew = Math.random() >= 0.5;
        if(!isNew) discount = Math.floor(Math.random() * 100);
        await Good.create({
            name: `test${i}`,
            brand: currentGoods[randomCurrentGoods].brand,
            colors: currentGoods[randomCurrentGoods].colors,
            category: categories[randomCategories],
            price: currentGoods[randomCurrentGoods].price,
            'description-en': currentGoods[randomCurrentGoods]['description-en'],
            'description-ru': currentGoods[randomCurrentGoods]['description-ru'],
            'description-ua': currentGoods[randomCurrentGoods]['description-ua'],
            imgs: currentGoods[randomCurrentGoods].imgs,
            isNewGood: isNew,
            discount: discount
        })
    }
    res.status(200).json({success: true});
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

async function getAll(req, res){
    const goods = await Good.find();
    const type = req.query.type;
    let array = [];
    for(let i = 0; i<goods.length; i++) {
        array = array.concat(goods[i][`${type}`]);
    }
    res.json({result: array.filter(onlyUnique)})
}

function sortByRate(a, b) {
    return  a.rate['$numberDecimal'] - b.rate['$numberDecimal'];
}

async function getBestGoods(req, res) {
    const count = req.query.size;
    const goods = (await Good.find()).sort(sortByRate);
    res.json(goods.slice(0, count));
}

async function getSuperPropose(req, res) {
    const goods = await Good.find({isSuperPropose: true});
    res.json(goods)
}

async function getNewGoods(req, res){
    const count = req.query.size;
    const goods = await Good.find({isNewGood: true});
    res.json(goods.slice(0, count));
}

async function getDiscountGoods(req, res){
    const count = req.query.size;
    const goods = await Good.find({ discount: { $ne: 0 }});
    res.json(goods.slice(0, count));
}

async function setTimerForSuperProposition(req, res) {
    const timer = req.body.timer;
    let query = {
        timerOfPropose: timer
    };
    if(timer === 0 || timer < 0) {
        query['isSuperPropose'] = false;
    }
    await Good.findOneAndUpdate({_id: req.body.id}, {$set: query}, {upsert:true})
        .then(result =>{res.json(result)})
        .catch(error => console.log(error))
}

async function updateOrDelete(req, res) {
    const type = req.body.updateOrDelete;
    if(type === 'Update'){
        await Good.findOneAndUpdate({_id: req.body.id}, {$set: req.body}, {upsert:true})
            .then(result =>{res.json(result)})
            .catch(error => console.log(error))
    } else {
        await Good.findOneAndDelete({_id: req.body.id})
            .then(result =>{res.json(result)})
            .catch(error => console.log(error))
    }
}

module.exports = {
    create,
    getById,
    updateRating,
    updateRate,
    addTestGoods,
    getAll,
    getAllGoods,
    getBestGoods,
    getSuperPropose,
    getNewGoods,
    getDiscountGoods,
    setTimerForSuperProposition,
    updateOrDelete
};