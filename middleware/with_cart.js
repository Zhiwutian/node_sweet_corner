const jwt = require('jwt-simple');
const { cartSecret } = require("../config").jwt;
const db = require('../db');

module.exports = async (req, res, next) => {
    try {

       const { 'x-cart-token': cartToken } = req.headers;
       req.cart = null;

       if (cartToken) {
            const cartData = jwt.decode(cartToken, cartSecret);

            const [[cart = null]] = await db.query(
                `SELECT * FROM carts AS c JOIN cartItems AS ci ON ci.cartId=c.id WHERE c.id=1 AND c.deletedAt IS NULL AND ci.deletedAt IS NULL`
            );

            if(!cart) {
                throw new StatusError (422, "Invalid Cart Token!");
            }
            req.cart = cart;

       }

        next();

    } catch (error) {
        next(error);
    }
}
