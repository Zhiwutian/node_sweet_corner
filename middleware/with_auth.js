const jwt = require("jwt-simple");
const db = require(__root + '/db')
const { authSecret } = require(__root + "/config").jwt;


module.exports = async (req, res, next) => {

    try {

        const  { authorization } = req.headers;

        if(!authorization) {
            throw new StatusError(401, "not authorized");
        }

        let tokenData = null;

        try {
            tokenData = jwt.decode(authorization, authSecret);
        }catch(err){

            throw new StatusError(401, "Keep knocking but you can't come in.")
        }

        const [[user = null]] = await db.execute(
            `SELECT id, CONCAT(firstName, " ", lastName) AS name, email, pid FROM users WHERE id=?`,
            [tokenData.id]
        );

        if(!user){
            throw new StatusError(401, "No authorization received from client");
        }

        req.user = user;

        next();
    }catch(err){
        next(err);
    }

}
