var express = require('express');
var cors = require('cors');
const userRoutes = require('./router/user');
const googleRoutes = require('./router/google');
const bucketRoutes = require('./router/bucket');
const database = require('./database');


const dotenv = require('dotenv');
dotenv.config();

var app = express();
app.use(express.json());

var corsOptions = {
  origin: ['http://localhost:8080','http://localhost:8085', 'https://gallant-edison-0dd970.netlify.com'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/', function(req, res){
	res.status(200).json({status: 'OK'})
});

app.use(userRoutes);
app.use(googleRoutes);
app.use(bucketRoutes);

const port = process.env.PORT || 3005;
app.listen(port, () => console.log('server started on port', port));
