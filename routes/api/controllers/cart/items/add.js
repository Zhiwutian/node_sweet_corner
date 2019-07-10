module.exports = async (req, res, next) => {

    try {
        const { body: {quantity}, params: {product_id}} = req;


        res.send({
            message: "Add Item to Cart",
            product_id,
            quantity
        } );

    }catch(error) {
        next(error);
    }


}
