const dotenv = require('dotenv');
const User = require('./models/user');
let mongoose = require('mongoose');
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive.appdata','https://www.googleapis.com/auth/userinfo.email']
const credentials = { client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET, redirect_uris: process.env.REDIRECT_URIS }

const {google} = require('googleapis');

const DATA_FILE_NAME = "data.json";

class GoogleAuth{     
    createAuthClient(tokens) {
        const client = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris);
        if(tokens) {
            client.setCredentials(tokens); 
        }

        client.on('tokens', (tokens) => {
            console.log("Token refreshed", tokens);
          });
          return client;
    }

    createDriveClient(tokens) {
        const client = this.createAuthClient(tokens);
        return  google.drive({version: 'v3', auth: client});
    }
    
    createUrl() {
        //return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
        return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
    }

    async handleAccessCode(code, userCallBack) {
        const client =  this.createAuthClient();
        client.getToken(code, async function (err, tokens) {
            console.log(tokens);
            if (err) {
                console.log(err);
            } else {
                client.setCredentials(tokens); 
                console.log("received tokens", tokens);
                var oauth2 = google.oauth2({ version: 'v2', auth: client });
                oauth2.userinfo.get(async function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        userCallBack(await User.saveGoogleTokens(res.data.email, tokens));
                    }
                });
            }
        });
    }

    saveDataToDrive(data, user){
        console.log("User:", user.email);
        console.log("Saving data", data);
        return new Promise((resolve, reject) => {
            let client = this.createAuthClient();
            client.setCredentials(user.google);
            console.log("client", client);
            this.upload(JSON.stringify(data), client)
                .then(file => { return resolve(file)})
                .catch(err => { return reject(err)});
        });
    }

    loadDataFromDrive(user){
        console.log("Loading data for", user.email);
        return new Promise((resolve, reject) => {
            const drive = this.createDriveClient(user.google);
            this.find(drive, DATA_FILE_NAME)
                .then(files => {
                    console.log("Files", files);
                    if(files.length === 1) {
                        return this.get(drive, files[0].id);
                    } else if(files.length === 0) {
                        throw DATA_FILE_NAME + " not found";
                    } else {
                        throw "found multilple " + DATA_FILE_NAME;
                    }
                })
                .then(data => { resolve(data)})
                .catch(err => { reject(err)});
        });
    }

    listFiles(user) {
        console.log("Listing files for", user.email);
        return new Promise((resolve, reject) => {
            const drive = this.createDriveClient(user.google);
            this.list(drive)
                .then(files => { resolve(files)})
                .catch(err => { reject(err)});
        });
    }

    upload(data, client)
    {
        return new Promise((resolve, reject) => {
            console.log("Uploading", data);
            const drive = google.drive({version: 'v3', auth: client});
            console.log("drive", drive);
            var fileMetadata = {
                'name': 'data.json',
                'parents': ['appDataFolder']
            };
            var media = {
                mimeType: 'application/json',
                body: data
            };
            drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                }, function (err, file) {
                    if (err) {
                        console.log("Drive error", err);
                        reject(err)
                    } else {
                        console.log("Uploaded:", file);
                        resolve(file);
                    }
                });
        });
    }

    list(drive){
        console.log("Listing files");
        return new Promise((resolve, reject) => {
            drive.files.list({
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name)',
                pageSize: 100
            }, function (err, res) {
                if (err) {
                    console.log("Drive error", err);
                    reject(err)
                } else {
                    resolve(res.data.files);
                }
            });
        });
    }

    find(drive, filename){
        console.log("Find file", filename);
        return new Promise((resolve, reject) => {            
            drive.files.list({
                q: "name='" + filename + "'",
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name)',
            }, function (err, res) {
                if (err) {
                    console.log("Drive error", err);
                    reject(err);
                } else {
                    console.log("Found");
                    resolve(res.data.files);
                }
            });
        });
    }

    get(drive, fileid){
        console.log("Getting file", fileid);
        return new Promise((resolve, reject) => {
            drive.files.get({
                fileId: fileid, alt: 'media'
            }, 
            function(err, res){
                if (err) {
                    console.log("Drive error", err);
                    reject(err);
                } else {
                    resolve(res.data);
                }
            });
        });
    }
    
}

module.exports = new GoogleAuth();