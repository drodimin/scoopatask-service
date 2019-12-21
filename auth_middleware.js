const jwt  = require('jsonwebtoken')
const User = require('./models/user')

const auth = async (req,res,next) => {
    try {
        console.log(req.route);
        const token = req.header('Authorization').replace('Bearer', '').trim()
        
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)
       
        console.log("Authorizing request...", decoded);

        let user;
        if(decoded.isGuest) {
            user = new User({email:'guest_' + decoded._id, isGuest: true});
        } else {
            user  = await User.findOne({ _id:decoded._id, 'tokens.token': token});
        }

        if(!user){
            throw new Error("")
        }
        console.log("Authorized User", user.email);
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error:'Please authenticate!'})
    }
}

module.exports = auth