const mongo = require("../mongo");
const utils = require("../utils");

class User {
    constructor(email) {
        const now = Date.now();
        this.createdAt = now;
        this.lastLoggedAt = now;
        this.updatedAt = now;
        this.email = email;
        this.tokens = [];
    }

    static async saveGoogleTokens(email, tokens) {
        console.log("Saving google tokens for " + email);
        const db = await mongo.database.connect();
        const collection = db.collection('users');

        const query = { 'email': email };
        console.log(query);
        const users = await collection.find(query).toArray();
        console.log(users);
        let user;
        if(!users || !users.length) {
            console.log(`User ${email} not found. Creating new.`);
            user = new User(email);
            user.google = tokens;
            const res = await collection.insertOne(user);
            user._id = res.insertedId;
            console.log("inserted", res);                    
        } else {
            user = users[0];
            const res = await collection.updateOne({ _id: user._id }, {$set: {google: tokens}});
            console.log("updated", res.result.n, res.result.nModified); 
        }
        return user;
    }

    static async newAuthToken(user) {
        console.log("Generating new auth token for " + user.email);
        const db = await mongo.database.connect();
        const collection = db.collection('users');

        const token = utils.createJWT(user._id);
        user.tokens.concat({ token })
        const query = { _id: mongo.ObjectID(user._id)};
        console.log("query", query);
        const res = await collection.updateOne(query, {$set: {tokens: user.tokens}});
        console.log("updated", res.result.n, res.result.nModified); 
        return token;
    }
}

module.exports = User;
