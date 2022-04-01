const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./router/user');
const googleRoutes = require('./router/google');
const bucketRoutes = require('./router/bucket');
const utilRoutes = require('./router/utils');
const appDataRoutes = require('./router/appdata');
const guestRoutes = require('./router/guest');

const logger = require('./logger');

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN.split(','),
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
app.listen(port, () => logger.info(`server started on port ${port}`));

