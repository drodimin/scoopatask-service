let mongoose = require('mongoose');

const db_user= process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb+srv://${db_user}:${db_password}@square1-kpmp1.mongodb.net/scoopatask`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
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