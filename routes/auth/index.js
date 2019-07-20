const router = require("express").Router();
const controllers = require("./controllers");
const createAccount = require(__root + '/middleware/create_Account');
const signIn = require(__root + '/middleware/sign_in');
const withCart = require(__root + "/middleware/with_cart");
const cartToUser = require(__root + "/middleware/cart_to_user");
const withAuth = require(__root + "/middleware/with_auth");


/*

    /auth Routes
*/

// /auth/create-account
router.post('/create-account', createAccount, withCart, cartToUser, controllers.createAccount);
// /auth/sign-in
router.post('/sign-in', signIn, withCart, cartToUser, controllers.signIn);
// /auth/sign-in
router.get('/sign-in', withAuth, controllers.signIn)
module.exports = router;
