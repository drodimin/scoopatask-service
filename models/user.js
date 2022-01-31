const mongo = require("../mongo");
const utils = require("../utils");

class User {
    constructor(email, isGuest = false) {
        const now = Date.now();
        this.createdAt = now;
        this.lastLoggedAt = now;
        this.updatedAt = now;
        this.email = email;
        this.tokens = [];
        this.isGuest = isGuest;
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
            console.log(`updated user record: ${email} updated count: ${res.result.n}, modified count: ${res.result.nModified}`); 
        }
        return user;
    }

    static async createToken(user) {
        console.log(`Generating new auth token for ${user.email}`);
        const token = utils.createJWT(user._id);
        const tokens = user.tokens.concat({ token });

        await User.updateTokens(user._id, tokens);
        return token;
    }

    static async removeToken(user, token) {
        console.log(`Removing ${token} for ${user.email}`);
        console.log("Current tokens", user.tokens);

        const tokens = user.tokens.filter(t => t.token !== token);
        console.log("New tokens", tokens);
        await User.updateTokens(user._id, tokens);
    }

    static async updateTokens(id, tokens) {
        const db = await mongo.database.connect();
        const collection = db.collection('users');
        const query = { _id: id};
        const res = await collection.updateOne(query, {$set: {tokens: tokens}});
        console.log(`updated tokens in database for user ${id}, matchedCount: ${res.matchedCount}, modifiedCount: ${res.modifiedCount}`); 
    }
}

module.exports = User;
