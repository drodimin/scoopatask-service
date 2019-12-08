const dotenv = require('dotenv');
const User = require('./models/user');
let mongoose = require('mongoose');
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive.appdata','https://www.googleapis.com/auth/userinfo.email']
const credentials = { client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET, redirect_uris: process.env.REDIRECT_URIS }

const {google} = require('googleapis');

class GoogleAuth{     
    createAuthClient() {
        console.log(credentials);
        return new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris);
    }
    
    createUrl() {
        //return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
        return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES});
    }

    async handleAccessCode(code, userCallBack) {
        const client =  this.createAuthClient();
        client.getToken(code, async function (err, tokens) {
            console.log(tokens);
            if (err) {
                console.log(err);
            } else {
                client.setCredentials(tokens);  
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

    saveToDrive(data, user){
        console.log("User:", user.email);
        console.log("Saving data", data);
        return new Promise((resolve, reject) => {
            let client = this.createAuthClient();
            client.setCredentials(user.google);
            this.upload(JSON.stringify(data), client)
                .then(file => { return resolve(file)})
                .catch(err => { return reject(err)});
        });
    }

    upload(data, client)
    {
        return new Promise((resolve, reject) => {
            const drive = google.drive({version: 'v3', client});
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
                        return reject(err)
                    } else {
                        console.log("Uploaded:", file);
                        resolve(file);
                    }
                });
        });
    }
}

module.exports = new GoogleAuth();