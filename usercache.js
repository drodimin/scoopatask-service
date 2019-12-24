const AppData = require('./appdata');

class UserCache {
    constructor() {
        this.loadPromises = {};
    }

    async getOrCreate(id) {
        if(this[id]) {
            console.log(`data for user ${id} is already loaded`);
            return this[id];
        } else if(this.loadPromises[id]) {
            console.log(`data for user ${id} is still loading`);
            return await this.loadPromise[id];
        } else {
            console.log(`creating new data for user ${id}`);
            //Requesting data for with set(..) was not called. This will happen for guest user so just create new data
            this[id] = new AppData();
            return this[id];
        }
    }

    set(id, loadPromise) {
        loadPromise.then((data) => {
            this[id] = new AppData(data);
            console.log(`finish loading data for user ${id}`);
        })
        this.loadPromises[id] = loadPromise;
    }
  }

 module.exports = new UserCache();