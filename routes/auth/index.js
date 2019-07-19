const router = require("express").Router();
const controllers = require("./controllers");
const createAccount = require(__root + '/middleware/create_Account');
const signIn = require(__root + '/middleware/sign_in')


/*

    /auth Routes
*/

// /auth/create-account
router.post('/create-account', createAccount, controllers.createAccount);
// /auth/sign-in
router.post('/sign-in', signIn, controllers.signIn);
module.exports = router;
