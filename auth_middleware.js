const jwt  = require('jsonwebtoken');
const User = require('./models/user');
const mongo = require("./mongo");

const auth = async (req,res,next) => {
    try {
        console.log(req.route.path);
        const token = req.header('Authorization').replace('Bearer', '').trim()
        
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)
       
        console.log("Authorizing request...", decoded);

        let user;
        if(decoded.isGuest) {
            user = new User('guest_' + decoded._id, true);
        } else {
            const db = await mongo.database.connect();
            const collection = db.collection('users');

            /*
            const allusers = await collection.find().toArray();
            allusers.forEach(element => {
                console.log(element.tokens);
            });
            */

            const query = { _id: mongo.ObjectID(decoded._id), 'tokens.token': token };
            console.log("query", query);
            const users = await collection.find(query).toArray();
            if(!users || users.length !== 1) {
                throw new Error('User not found');
            }
            user = users[0];
        }
        console.log("Authorized User", user.email);
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        if (error.errno === 'ECONNREFUSED') {
            res.status(500).send();
        } else {
            res.status(401).send({error:'Please authenticate!'});
        }
    }
}

module.exports = auth