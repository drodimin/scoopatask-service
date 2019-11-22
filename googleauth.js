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
        return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
    }

    async handleAccessCode(code, userCallBack) {
        const client =  this.createAuthClient();;
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
}

module.exports = new GoogleAuth()