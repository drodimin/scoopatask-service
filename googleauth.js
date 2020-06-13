const dotenv = require('dotenv');
const User = require('./models/user');
const AppData = require('./appdata/appdata');
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
        //return this.createAuthClient().AuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
        return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
    }

    async handleAccessCode(code, userCallBack) {
        const client =  this.createAuthClient();
        client.getToken(code, async function (err, tokens) {
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
            const drive = this.createDriveClient(user.google);
            this.find(drive, DATA_FILE_NAME)
                .then(files => {
                    console.log("Files", files);
                    if(files.length === 1) {
                        this.update(drive, files[0].id, JSON.stringify(data))
                            .then(file => { 
                                console.log("Resolving saveDataToDrive 1");
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else if(files.length === 0) {
                        this.upload(JSON.stringify(data), drive)
                            .then(file => { 
                                console.log("Resolving saveDataToDrive 2");
                                resolve(file)
                            })
                            .catch(err => { reject(err)});
                    } else {
                        reject("found multilple " + DATA_FILE_NAME);
                    }
                })
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
                        return {};
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

    upload(data, drive)
    {
        return new Promise((resolve, reject) => {
            console.log("Uploading", data);
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
                        console.log("Uploaded:", file.data);
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
                    resolve(new AppData(res.data));
                }
            });
        });
    }

    update(drive, fileid, data){
        console.log("Updating file", fileid);
        return new Promise((resolve, reject) => {
            drive.files.update({
                fileId: fileid,
                media: {
                    mimeType: 'application/json',
                    body: data
                }},
                function (err, file) {
                    if (err) {
                        console.log("Drive error", err);
                        reject(err);
                    } else {
                        resolve(file);
                    }
                });     
            }); 
    }

    delete(drive, fileid){
        console.log("Deleting file", fileid);
        return new Promise((resolve, reject) => {
            drive.files.delete({
                fileId: fileid},
                function (err, file) {
                    if (err) {
                        console.log("Drive error", err);
                        reject(err);
                    } else {
                        resolve(file);
                    }
                }); 
        });     
    }
    
}

module.exports = new GoogleAuth();