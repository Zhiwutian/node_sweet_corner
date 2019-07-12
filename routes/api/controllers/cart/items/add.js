const jwt = require('jwt-simple');
const db = require(__root + '/db');
const { cartSecret } = require(__root + '/config').jwt;


module.exports = async (req, res, next) => {

    try {
        const { body: {quantity}, headers: {"x-cart-token": cartToken} ,params: {product_id}} = req;


        if(cartToken) {
            // Retrieve cart data
        } else {
            // Create a new cart
            const [[cartStatus = null]] = await db.query('SELECT id FROM cartStatuses WHERE mid ="active"');

            console.log("Cart Status ", cartStatus);

            if(!cartStatus) {
                throw new StatusError(500, "Unable to find cart status");
            }

            const result = await db.query(`INSERT INTO carts (lastInteraction, pid, createdAt, updatedAt, statusId) VALUES (CURRENT_TIME, UUID(), CURRENT_TIME, CURRENT_TIME, ${cartStatus.id})`);

            console.log("REsult ", result);
        }



        res.send({
            message: "Add Item to Cart",
            product_id,
            quantity,
            cartToken
        } );

    }catch(error) {
        next(error);
    }


}
