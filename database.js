let mongoose = require('mongoose');

const db_user= process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_server = process.env.DB_SERVER;
console.log(db_user);

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
    //mongoose.connect(`mongodb+srv://${db_user}:${db_password}@square1-kpmp1.mongodb.net/scoopatask`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
     mongoose.connect(`mongodb://127.0.0.1:27017/scoopatask?gssapiServiceName=mongodb`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error(`Database connection error (${db_user}:${db_password}):`)
         console.error(err)
       })
  }
}

module.exports = new Database()