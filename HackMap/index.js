////////////////////////// Server Essentials ////////////////////////// 
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
})

var db1;
MongoClient.connect('mongodb://abwilf:blah123@ds159050.mlab.com:59050/hackmap', function(err, db) {
  console.log("Connected correctly to server");
  console.log(err);
  db1 = db;
});

app.get('/', function(req, res) {
	res.sendFile('./index.html', {root: __dirname});
	console.log("money");
})

app.post('/data', function(req, res) {
	console.log(Object.keys(req.body));
	var collection = db1.collection('maps');	// name of collection
	collection.insert(req.body, function(err, result) {
		console.log(err, result);
	});
	res.send(req.body);
})

app.get('/data/:id', function(req, res) {
	var collection = db1.collection('maps');	// name of collection
	if (req.params.id) {
		collection.findOne({_id: new mongo.ObjectID(req.params.id)}, function(err, result) {
			res.send(result);
		});
	} else {
		collection.findOne({}, function(err, result) {
			res.send(result);
		});
	}
	
})
//////////////////////////////////////////////////////////////////////// 


// Done so far:
// 	set up mongodb database
// 	communicate with it via express
// 	use their unique identifier to grab maps
// 	dehydrate nodes to deal with storage

// Need to do:
// 	rehydrate nodes and re-render root object from them
// 	push all this shit onto a server (heroku)