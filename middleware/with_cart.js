const jwt = require('jwt-simple');
const { cartSecret } = require("../config").jwt;
const db = require('../db');

module.exports = async (req, res, next) => {
    try {

       const { 'x-cart-token': cartToken } = req.headers;
       req.cart = null;

       const [[cartStatus = null]] = await db.query(
           `SELECT id FROM cartStatuses WHERE mid="active"`
       );

       if(!cartStatus) {
           throw new StatusError(500, "Error retrieving cart data")
       }

       const cartQuery = `SELECT c.id AS cartId, c.lastInteraction, c.pid, c.createdAt,
       c.updatedAt, c.userId, c.statusId AS cartStatusId,
       ci.quantity, p.cost, p.id AS productId FROM carts AS c
       JOIN cartItems AS ci ON ci.cartId=c.id
       JOIN products AS p ON ci.productId=p.id
       WHERE c.deletedAt IS NULL AND ci.deletedAt IS NULL AND c.statusId = ${cartStatus.id} `;
       let cartWhere = null;
      if(req.user){
        cartWhere = ` AND c.userId=${req.user.id}`


      }else if (cartToken) {
            const cartData = jwt.decode(cartToken, cartSecret);
            cartWhere = ` AND c.id=${cartData.cartId}`

       }
       if(cartWhere){
        const [cart=null] = await db.query(
            cartQuery + cartWhere
        );


       if (cart && cart.length) {
        const {cost, quantity, productId, ...cartItem} = cart[0];

        const formattedCart = {
            ...cartItem,
            items: cart.map(({cost,quantity, productId}) =>({cost, quantity, productId}))
        };

        // const formattedCart = {
        //     ...cartItem,
        //     items: cart.map((item) => {
        //         return {
        //             cost: item.cost,
        //             quantity: item.quantity
        //         }
        //     })
        // }
        // cart.forEach(item => {
            // formattedCart.id = item.id;
            // formattedCart.lastInteraction = item.lastInteraction;
            // formattedCart.pid = item.pid;
            // formattedCart.createdAt = item.createdAt;
            // formattedCart.userId = item.userId;
            // formattedCart.cartStatudId = item.cartStatusId;

            // formattedCart.items.push({
            //     cost: item.cost,
            //     quantity: item.quantity
            // });
        // });
        req.cart = formattedCart;
       }
       }
        next();

    } catch (error) {
        next(error);
    }
}
