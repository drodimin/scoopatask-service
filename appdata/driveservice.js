const exceptions = require('../exceptions');
const constants = require('../constants');
const DriveClient = require('drive-appdata-client');
const googleauth = require('../googleauth');

module.exports = class DriveService {
    constructor() {
    }
    
    async saveDataToDrive(data, user){
        if(!data) {
            throw new exceptions.ArgumentNullException(`data`);
        }
        if(!user) {
            throw new exceptions.ArgumentNullException(`user`);
        }
        if(!user.email) {
            throw new exceptions.ArgumentException(`user.email`);
        }
        if(!user.google) {
            throw new exceptions.ArgumentException(`user.google`);
        }

        const authClient = await googleauth.createAuthClient(user.google);
        const driveClient = new DriveClient(authClient);

        console.log('Saving data', data, user.email);
        return new Promise((resolve, reject) => {
            driveClient.find(constants.DATA_FILE_NAME)
                .then(files => {
                    if(files.length === 1) {
                        driveClient.update(files[0].id, JSON.stringify(data))
                            .then(file => { 
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else if(files.length === 0) {
                        driveClient.create(constants.DATA_FILE_NAME, JSON.stringify(data))
                            .then(file => { 
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else {
                        reject("found multiple " + constants.DATA_FILE_NAME);
                    }
                })
        });
    }

    async loadDataFromDrive(user){
        if(!user) {
            throw new exceptions.ArgumentNullException(`user`);
        }
        if(!user.email) {
            throw new exceptions.ArgumentException(`user.email`);
        }
        if(!user.google) {
            throw new exceptions.ArgumentException(`user.google`);
        }

        const authClient = await googleauth.createAuthClient(user.google);
        const driveClient = new DriveClient(authClient);

        console.log("Loading data for", user.email);
        return new Promise((resolve, reject) => {
            driveClient.find(constants.DATA_FILE_NAME)
                .then(files => {
                    if(files.length === 1) {
                        return driveClient.get(files[0].id);
                    } else if(files.length === 0) {
                        return {};
                    } else {
                        throw "found multiple " + constants.DATA_FILE_NAME;
                    }
                })
                .then(data => { resolve(data)})
                .catch(err => { 
                    console.log(`Fail to load ${constants.DATA_FILE_NAME}`, err);
                    reject(err)
                });
        });
    }

    async saveHistoryToDrive(history, user){
        if(!history) {
            throw new exceptions.ArgumentNullException(`history`);
        }
        if(!user) {
            throw new exceptions.ArgumentNullException(`user`);
        }
        if(!user.email) {
            throw new exceptions.ArgumentException(`user.email`);
        }
        if(!user.google) {
            throw new exceptions.ArgumentException(`user.google`);
        }

        const authClient = await googleauth.createAuthClient(user.google);
        const driveClient = new DriveClient(authClient);

        console.log('Saving history', history, user.email);
        return new Promise((resolve, reject) => {
            driveClient.find(constants.HISTORY_FILE_NAME)
                .then(files => {
                    if(files.length === 1) {
                        driveClient.update(files[0].id, JSON.stringify(history))
                            .then(file => { 
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else if(files.length === 0) {
                        driveClient.create(constants.HISTORY_FILE_NAME, JSON.stringify(history))
                            .then(file => { 
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else {
                        reject("found multiple " + constants.HISTORY_FILE_NAME);
                    }
                })
        });
    }

    async loadHistoryFromDrive(user){
        if(!user) {
            throw new exceptions.ArgumentNullException(`user`);
        }
        if(!user.email) {
            throw new exceptions.ArgumentException(`user.email`);
        }
        if(!user.google) {
            throw new exceptions.ArgumentException(`user.google`);
        }

        const authClient = await googleauth.createAuthClient(user.google);
        const driveClient = new DriveClient(authClient);

        console.log("Loading history for", user.email);
        return new Promise((resolve, reject) => {
            driveClient.find(constants.HISTORY_FILE_NAME)
                .then(files => {
                    console.log("Files", files);
                    if(files.length === 1) {
                        return driveClient.get(files[0].id);
                    } else if(files.length === 0) {
                        return {};
                    } else {
                        throw "found multiple " + constants.HISTORY_FILE_NAME;
                    }
                })
                .then(data => { resolve(data)})
                .catch(err => { reject(err)});
        });
    }

}