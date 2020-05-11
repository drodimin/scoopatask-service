const AppData = require('./appdata/appdata');
const googleauth = require('./googleauth');
const exceptions = require('./exceptions');

class UserCache {
    constructor() {
        this.loadPromises = {};
        this.historyLoadPromises = {};
        this.history = {};
    }

    getOrCreateUserData(user) {
        if(!user.email) {
            throw new Error('User email is missing');
        }
        const id = user.email;
        if(this[id]) {
            console.log(`data for user ${id} is already loaded`);
            return this[id];
        } else if(this.loadPromises[id]) {
            console.log(`data for user ${id} is still loading`);
            return this.loadPromises[id];
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
                return this.loadPromises[id];
            }
        }            
    }

    getOrCreateUserHistoryData(user) {
        if(!user.email) {
            throw new Error('User email is missing');
        }
        const id = user.email;
        if(this.history[id]) {
            console.log(`history data for user ${id} is already loaded`);
            return this.history[id];
        } else if(this.historyLoadPromises[id]) {
            console.log(`history data for user ${id} is still loading`);
            return this.historyLoadPromises[id];
        } 
        return undefined;
    }
}

 module.exports = {cacheInstance:new UserCache(), UserCache: UserCache }