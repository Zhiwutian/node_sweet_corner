const router = require("express").Router();
const { getAll, getOne} = require("./controllers/products");

/*
  /api/products
*/


router.get("/", getAll);
router.get("/:product_id", getOne);


module.exports = router;
