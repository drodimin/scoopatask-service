const dotenv = require('dotenv');
const User = require('./models/user');
const AppData = require('./appdata/appdata');
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive.appdata','https://www.googleapis.com/auth/userinfo.email']
const credentials = { client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET, redirect_uris: process.env.REDIRECT_URIS }

const {google} = require('googleapis');
const { error } = require('winston');

const DATA_FILE_NAME = "data.json";

class GoogleAuth{     
    async createAuthClient(tokens) {
        const client = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris);
        if(tokens) {   
                  
            try{
                // verify token
                await client.getTokenInfo(tokens.access_token);
                console.log("Using existing tokens");
                client.setCredentials(tokens); 
            }catch(error){
                console.log('Existing tokens not valid', error);
                client.setCredentials({
                    refresh_token: tokens.refreshToken
                  });
                  
                const accessTokenResult = await client.getAccessToken();
                console.log(accessTokenResult);
            }
            
        }

        client.on('tokens', (tokens) => {
            console.log("Token refreshed", tokens);
          });
        return client;
    }
    
    async createUrl() {
        //return this.createAuthClient().AuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'consent'});
        const client = await this.createAuthClient();
        return client.generateAuthUrl({access_type: 'offline', scope: SCOPES, prompt: 'select_account'});
    }

    async signInUserWithAccessCode(code) {
        const client =  await this.createAuthClient();
        const tokens = await client.getToken(code);
        client.setCredentials(tokens.tokens); 
        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const googleuser = await oauth2.userinfo.get();
        return await User.saveGoogleTokens(googleuser.data.email, tokens.tokens);
    }
}

module.exports = new GoogleAuth();