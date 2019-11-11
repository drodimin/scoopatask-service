const SCOPES = ['https://www.googleapis.com/auth/drive.appdata']
const credentials = { client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET, redirect_uris: process.env.REDIRECT_URIS }

const {google} = require('googleapis');

class GoogleAuth{     
    createAuthClient() {
        return new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris);
    }
    
    createUrl() {
        return this.createAuthClient().generateAuthUrl({access_type: 'offline', scopes: SCOPES});
    }

    getToken(code) {
        const client =  this.createAuthClient();
        const tokens = client.getToken(code);
        client.setCredentials(tokens);        
        client.getTokenInfo(tokens.access_token);
    }
}

module.exports = new GoogleAuth()