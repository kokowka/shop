const goods = require('./goods');
const users = require('./users');
const email = require('./email');
const banner = require('./banner');
const comment = require('./comment');
const info = require('./info');
const blogs= require('./blogs');

const router = require('express').Router();

router.post('/goods/create', goods.create);
router.post('/goods/getAllGoods', goods.getAllGoods);
router.post('/goods/:id', goods.getById);
router.post('/register', users.register);
router.post('/logIn', users.logIn);
router.post('/isAdmin', users.isAdmin);
router.put('/goods/updateRating', goods.updateRating);
router.put('/goods/updateRate', goods.updateRate);
router.post('/sendEmail', email.sendEmail);
router.post('/goods/addTestGoods', goods.addTestGoods);
router.post('/getAll', goods.getAll);
router.post('/getBestGoods', goods.getBestGoods);
router.post('/getSuperPropose', goods.getSuperPropose);
router.post('/getNewGoods', goods.getNewGoods);
router.post('/getDiscountGoods', goods.getDiscountGoods);
router.post('/createBanner', banner.create);
router.post('/getBannerByType', banner.getByType);
router.put('/setTimerForSuperProposition', goods.setTimerForSuperProposition);
router.post('/addComment', comment.add);
router.post('/getAllCommentById', comment.getAllById);
router.put('/updateOrDeleteGood', goods.updateOrDelete);
router.post('/createInfo', info.create);
router.post('/getInfo', info.getByType);
router.post('/getLastComments', comment.getLastComments);
router.post('/createPost', blogs.create);
router.post('/getPosts', blogs.get);
router.post('/getPostsById', blogs.getById);

module.exports = router;