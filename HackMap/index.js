var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var expstate = require('express-state');
var app = express();
var PORT = 3000;

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
expstate.extend(app);

app.set("state namespace", 'App');
// var API_KEYS = {
// 	"GOOGLE_API_KEY": "102938120938123", 
// 	"FACEBOOK_API_KEY": "12039812093",
// }
// app.expose(API_KEYS, "API_KEYS");


var db1;
MongoClient.connect('mongodb://abwilf:blah123@ds159050.mlab.com:59050/hackmap', function(err, db) {
  console.log("Connected correctly to server");
  console.log(err);
  db1 = db;
});

var RESULT;

app.get('/data/:id', function(req, res) {
	var collection = db1.collection('maps');	// name of collection
	if (req.params.id) {
		collection.findOne({_id: new mongo.ObjectID(req.params.id)}, function(err, result) {
			RESULT = result;
			app.expose(RESULT, "RESULT");
			res.render("home");
		});
	}
})

app.get("/", function(req, res) {
	RESULT = -1;
	app.expose(RESULT, "RESULT");
	res.render("home");
});

app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});
