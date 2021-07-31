const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const dotenv = require('dotenv');

const userRoutes = require('./router/user');
const googleRoutes = require('./router/google');
const bucketRoutes = require('./router/bucket');
const utilRoutes = require('./router/utils');
const appDataRoutes = require('./router/appdata');
const guestRoutes = require('./router/guest');

dotenv.config();
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var app = express();
app.use(express.json());

var corsOptions = {
  origin: [process.env.CORS_ORIGIN],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/', function(req, res){
	res.status(200).json({status: 'OK'})
});

app.use(userRoutes);
app.use(googleRoutes);
app.use(bucketRoutes);
app.use(utilRoutes);
app.use(appDataRoutes);
app.use(guestRoutes);

const port = process.env.PORT || 3005;
app.listen(port, () => console.log('server started on port', port));
