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
            console.log("Using existing tokens", tokens);
            client.setCredentials(tokens); 
        }

        client.on('tokens', (tokens) => {
            console.log("Token refreshed", tokens);
          });
          return client;
    }
    
    createUrl() {
        //return this.createAuthClient().AuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
        return this.createAuthClient().generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
    }

    async signInUserWithAccessCode(code) {
        const client =  this.createAuthClient();
        const tokens = await client.getToken(code);
        client.setCredentials(tokens.tokens); 
        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const googleuser = await oauth2.userinfo.get();
        return await User.saveGoogleTokens(googleuser.data.email, tokens.tokens);
    }
}

module.exports = new GoogleAuth();