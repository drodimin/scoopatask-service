const AppData = require('./appdata');

class UserCache {
    getOrCreate(id) {
        if(!this[id]) {
            console.log("Creating appData for", id);
            this[id] = new AppData();
        } 
        return this[id];
    }
  }

 module.exports = new UserCache();