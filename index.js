var express = require('express');
var cors = require('cors');
const fs = require('fs');

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

const port = process.env.PORT || 3005;
app.listen(port, () => console.log('server started on port', port));
