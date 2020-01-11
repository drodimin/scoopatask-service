
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const DATABASE_NAME = 'scoopatask';
const db_user= process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_server = process.env.DB_SERVER;

class Database {
    connect() {
        console.log('Acquiring connection');
        return new Promise((resolve, reject) => {
            if(this.isConnected && this.db) {
                console.log('Reusing existing connection');
                resolve(this.db);
            } else {
                console.log('Creating mongo client');
                const connectionString = db_server.includes('127.0.0.1') ? 'mongodb://localhost:27017' : 
                    `mongodb+srv://${db_user}:${db_password}@${db_server}`
                console.log(connectionString);
                this.client = MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true  })
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