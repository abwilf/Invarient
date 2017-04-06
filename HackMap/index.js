////////////////////////// Server Essentials ////////////////////////// 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
})

app.get('/', function(req, res) {
	res.sendFile('./index.html', {root: __dirname});
	console.log("money");
})
//////////////////////////////////////////////////////////////////////// 