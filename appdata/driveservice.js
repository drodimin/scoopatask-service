const exceptions = require('../exceptions');
const constants = require('../constants');
const DriveClient = require('drive-appdata-client');
const googleauth = require('../googleauth');

module.exports = class DriveService {
    constructor() {
    }
    
    saveDataToDrive(data, user){
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

        const driveClient = new DriveClient(googleauth.createAuthClient(user.google));

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

    loadDataFromDrive(user){
        if(!user) {
            throw new exceptions.ArgumentNullException(`user`);
        }
        if(!user.email) {
            throw new exceptions.ArgumentException(`user.email`);
        }
        if(!user.google) {
            throw new exceptions.ArgumentException(`user.google`);
        }

        const driveClient = new DriveClient(googleauth.createAuthClient(user.google));

        console.log("Loading data for", user.email);
        return new Promise((resolve, reject) => {
            driveClient.find(constants.DATA_FILE_NAME)
                .then(files => {
                    console.log("Files", files);
                    if(files.length === 1) {
                        return driveClient.get(files[0].id);
                    } else if(files.length === 0) {
                        return {};
                    } else {
                        throw "found multiple " + constants.DATA_FILE_NAME;
                    }
                })
                .then(data => { resolve(data)})
                .catch(err => { reject(err)});
        });
    }


}