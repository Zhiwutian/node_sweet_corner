const router = require('express').Router();
const withCart = require(__root + '/middleware/with_cart');
const { getCart, items } = require("./controllers/cart");
const optionalAuth = require(__root + '/middleware/optional_auth');

/*
 /api/cart Routes
*/

router.get('/', optionalAuth, withCart, getCart);

router.post('/items/:product_id', withCart, items.add);

module.exports = router
