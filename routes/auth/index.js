const router = require("express").Router();


/*

    /auth Routes
*/


router.get("/test", (req,res)=>{
    res.send("Testing Auth Router auth/test");
});
module.exports = router;
