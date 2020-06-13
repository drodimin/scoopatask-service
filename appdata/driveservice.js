const exceptions = require('../exceptions');
const constants = require('../constants');
const DriveClient = require('drive-appdata-client');
const googleauth = require('../googleauth');

module.exports = class DriveService {
    constructor() {
        this._driveClient = new DriveClient(googleauth.createAuthClient());
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

        console.log('Saving data', data, user.email);
        return new Promise((resolve, reject) => {
            this._driveClient.find(constants.DATA_FILE_NAME)
                .then(files => {
                    if(files.length === 1) {
                        this._driveClient.update(files[0].id, JSON.stringify(data))
                            .then(file => { 
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else if(files.length === 0) {
                        this._driveClient.create(constants.DATA_FILE_NAME, JSON.stringify(data))
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
}