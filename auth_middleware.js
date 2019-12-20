const jwt  = require('jsonwebtoken');
const User = require('./models/user');
const mongo = require("./mongo");

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded", decoded);
        const db = await mongo.database.connect();
        const collection = db.collection('users');

        collection.find().toArray()
        .then((items) => {
            items.forEach(element => {
                console.log(element._id);
            });
        })
        const query = { _id: mongo.ObjectID(decoded._id) };
        console.log(query);
        const users = await collection.find(query).toArray();
        console.log(users);
        if(!users || users.length !== 1) {
            throw new Error('User not found');
        }
        //const user  = await User.findOne({ _id:decoded._id, 'tokens.token': token})
        const user = users[0];
        console.log(user);
        if(!user){
            throw new Error('User not found');
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        res.status(401).send({error:'Please authenticate!'})
    }
}

module.exports = auth