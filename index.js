var express = require('express');
var cors = require('cors');
const fs = require('fs');

var app = express();
app.use(express.json());

var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/', function(req, res){
	res.status(200).json({status: 'OK'})
});


app.listen(3005);
