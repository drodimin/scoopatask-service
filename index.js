var express = require('express');
var cors = require('cors');
const {google} = require('googleapis');
const userRoutes = require('./router/user')


const dotenv = require('dotenv');
dotenv.config();

const database = require('./database');

const SCOPES = ['https://www.googleapis.com/auth/drive.appdata']

const credentials = { client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET, redirect_uris: process.env.REDIRECT_URIS }
console.log(process.env.CLIENT_ID);

var app = express();
app.use(express.json());

var corsOptions = {
  origin: ['http://localhost:8080','https://gallant-edison-0dd970.netlify.com'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/', function(req, res){
	res.status(200).json({status: 'OK'})
});

app.use(userRoutes)

function createAuthClient() {
  const auth = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris);
}

const port = process.env.PORT || 3005;
app.listen(port, () => console.log('server started on port', port));
