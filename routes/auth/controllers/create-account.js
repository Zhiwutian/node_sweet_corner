
module.exports =  async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    const {id, token, ...user} = req.user;

    try{
        res.send({
            token: token,
            user:user
        })

    } catch(error){
        next(error);
    }
}
