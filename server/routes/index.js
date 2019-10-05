const goods = require('./goods');
const users = require('./users');
const email = require('./email');
const banner = require('./banner');
const comment = require('./comment');

const router = require('express').Router();

router.post('/goods/create', goods.create);
router.get('/goods/getAllGoods', goods.getAllGoods);
router.get('/goods/:id', goods.getById);
router.post('/register', users.register);
router.post('/logIn', users.logIn);
router.post('/isAdmin', users.isAdmin);
router.put('/goods/updateRating', goods.updateRating);
router.put('/goods/updateRate', goods.updateRate);
router.post('/sendEmail', email.sendEmail);
router.post('/goods/addTestGoods', goods.addTestGoods);
router.get('/getAll', goods.getAll);
router.get('/getBestGoods', goods.getBestGoods);
router.get('/getSuperPropose', goods.getSuperPropose);
router.get('/getNewGoods', goods.getNewGoods);
router.get('/getDiscountGoods', goods.getDiscountGoods);
router.post('/createBanner', banner.create);
router.get('/getBannerByType', banner.getByType);
router.put('/setTimerForSuperProposition', goods.setTimerForSuperProposition);
router.post('/addComment', comment.add);
router.get('/getAllCommentById', comment.getAllById);
router.put('/updateOrDeleteGood', goods.updateOrDelete);

module.exports = router;