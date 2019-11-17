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

    async getToken(code) {
        const client =  this.createAuthClient();
        client.acc
        console.log(code);
        client.getToken(code, async function (err, tokens) {
            console.log(tokens);
            if (err) {
                console.log(err);
            } else {
                client.setCredentials(tokens);  
                var oauth2 = google.oauth2({
                    version: 'v2', auth: client
                  });
                  oauth2.userinfo.get(
                    async function(err, res) {
                      if (err) {
                         console.log(err);
                      } else {
                         console.log(res.data.email);
                         let user = new User();
                         user.email = res.data.email;
                         user.google = tokens;
                         try{
                         await user.save();
                         }catch(err1){ console.log(err1)}
                      }
                  });
                /*
                const access_token = await client.getAccessToken();
                console.log(access_token);
                const ticket = await client.verifyIdToken({idToken: access_token, audience: credentials.client_id});
                console.log(ticket);
                const payload = ticket.getPayload();
                const userid = payload['sub'];

                let tokenInfo = await client.getTokenInfo(tokens.id_token);

                console.log(tokenInfo);
                */


            }
        });
    }
}

module.exports = new GoogleAuth()