
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const DATABASE_NAME = 'scoopatask';

class Database {
    connect() {
        console.log('Acquiring connection');
        return new Promise((resolve, reject) => {
            if(this.isConnected && this.db) {
                console.log('Reusing existing connection');
                resolve(db);
            } else {
                console.log('Creating mongo client');
                this.client = MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true  })
                .then((res) => {
                    this.isConnected = true;
                    this.db = res.db(DATABASE_NAME);;
                    console.log("Connection successful");
                    resolve(this.db);
                })
                .catch((err) => {
                    console.log("Connection failed", err);
                    reject(err);
                })
            }
        });
    }
}

module.exports = { database: new Database(), ObjectID: mongodb.ObjectID }