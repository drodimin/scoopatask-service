const AppData = require('./appdata/appdata');
const HistoryData = require('./appdata/historydata')
const services = require('./services');

class UserCache {
    constructor() {
        this.history = {};
    }

    getOrCreateUserData(user) {
        if(!user.email) {
            throw new Error('User email is missing');
        }
        const id = user.email;

        if(this[id]) {
            console.log(`data for user ${id} is already loaded or loading, ${this[id]}`);
            return this[id];
        } else {
            if(user.isGuest) {
                console.log(`creating new data for guest user ${id}`);
                this[id] = Promise.resolve(new AppData());
                return this[id];
            } else {
                console.log(`cannot find user ${id} in cache. start loading data`);
                this[id] = new Promise((resolve, reject) => {
                     services.driveService.loadDataFromDrive(user).then(data => {
                        console.log(`finish loading data for user ${id}`);
                        resolve(new AppData(data));
                    }).catch(error => reject(error));
                })
                return this[id];
            }
        }            
    }

    getOrCreateUserHistory(user) {
        if(!user.email) {
            throw new Error('User email is missing');
        }
        const id = user.email;
        if(this.history[id]) {
            console.log(`history data for user ${id} is already loaded or loading`);
            return this.history[id];
        } else {
            console.log(`cannot find user ${id} history data in cache. start loading data`);
            this.history[id] = new Promise((resolve, reject) => {
                services.driveService.loadHistoryFromDrive(user).then(data => {
                    console.log(`finish loading history data for user ${id}`);
                    resolve(new HistoryData(data));
                }).catch(error => reject(error));
            })
            return this.history[id];
        } 
    }

    updateUserData(user, data) {
        if(!user.email) {
            throw new Error('User email is missing');
        }
        if(!data) {
            throw new Error('User data is not defined');
        }
        const id = user.email;
        this[id] = data;
    }
}

 module.exports = {cacheInstance:new UserCache(), UserCache: UserCache }