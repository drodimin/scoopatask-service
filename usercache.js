const AppData = require('./appdata');
const googleauth = require('./googleauth');

class UserCache {
    constructor() {
        this.loadPromises = {};
    }

    async getOrCreate(user) {
        const id = user.email;
            if(this[id]) {
                console.log(`data for user ${id} is already loaded`);
                return this[id];
            } else if(this.loadPromises[user.id]) {
                console.log(`data for user ${id} is still loading`);
                return await this.loadPromise[id];
            } else {
                if(user.isGuest) {
                    console.log(`creating new data for guest user ${id}`);
                    this[id] = new AppData();
                    return this[id];
                } else {
                    console.log(`cannot find user ${user.id} in cache. start loading data`);
                    this.loadPromises[id] = googleauth.loadDataFromDrive(user);
                    this.loadPromises[id].then((data) => {
                        this[id] = new AppData(data);
                        console.log(`finish loading data for user ${id}`);
                    });
                    return await this.loadPromises[id];
                }
            }            
        }
    }

 module.exports = new UserCache();