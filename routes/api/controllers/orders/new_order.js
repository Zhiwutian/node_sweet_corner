const db = require(__root + '/db');


module.exports = async (req, res, next) => {
    try {

        if(!req.cart) {
            throw new StatusError(422, "No Active cart!!!")
        }

        const [[orderStatus = null]] = await db.query(
            `SELECT id FROM orderStatuses WHERE mid='pending'`
        );

        if(!orderStatus) {
            throw new StatusError(500, 'Error with order status');
        }

        let totalItems = 0;
        let totalCost = 0;

        req.cart.items.forEach(item => {
            totalCost += item.cost * item.quantity;
            totalItems += item.quantity;
        });

        const [newOrder] = await db.execute(
            `INSERT INTO orders (pid, itemCount, total, createdAt, updatedAt, cartId, statusId, userId)
            VALUES(UUID(), ?, ?, CURRENT_TIME, CURRENT_TIME, ?, ?, ?)`,
            [totalItems, totalCost, req.cart.cartId, orderStatus.id, req.user.id]
        );

        if(!newOrder.affectedRows) {
            throw new StatusError(500, 'Error Creating new order');
        }


        const orderId = newOrder.insertId;
        let itemsQueryValues = '';

        req.cart.items.forEach((item , index, items) => {
            itemsQueryValues += ` (UUID(), ${item.cost}, ${item.quantity}, CURRENT_TIME, CURRENT_TIME, ${orderId}, ${item.productId})`

            if (index < items.length - 1) {
                itemsQueryValues += ',';
            }
        });


        console.log("Query Values Result:", itemsQueryValues);

        const [ orderItems ] = await db.query(
            `INSERT INTO orderItems (pid, \`each\`, quantity, createdAt, updatedAt, orderId, productId)
            VALUES ${itemsQueryValues}`
        );

        console.log(orderItems);

        // Create order in order table

        // Create all associated order items

        // Update cart status to closed

        res.send({
            message: "Create new order",
            cart: req.cart,
            totalItems,
            totalCost
        });

    } catch(error) {
        next(error);
    }
}
