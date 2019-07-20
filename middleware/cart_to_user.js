const db = require(__root + "/db");

module.exports = async (req, res, next) => {
    try {
        //check if cart

        //if cart verify cart is active by chhecking status

        //add userId to cart

        //else if no cart, go to next thing
        if(req.cart && req.cart.userId) {
            if(req.cart.userId !== req.user.id) {
                throw new StatusError(401, "Illegal Cart token");
            }
            return next();
        }

        if(req.cart) {
            const [[cartStatus]] = await db.query(
                `SELECT id from cartStatuses WHERE mid = "active"`
            );

            if(cartStatus.id === req.cart.cartStatusId) {

                const [updateResult] = await db.query(
                    `UPDATE carts SET userId=${req.user.id} WHERE id=${req.cart.cartId}`
                );
            }

        }
        next();
    }catch(err) {
        next(err);
    }
}
