var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var map = require('./models/map');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var expstate = require('express-state');
var app = express();
var PORT = 3000;

// Load envirorment variables
dotenv.load();

// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// set up express app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
expstate.extend(app);
app.set("state namespace", 'App');


var RESULT;

app.get('/:id', function(req, res) {
    map.findOne({ _id: req.params.id }, function(err, map) {
        if (err) throw err;
        if (!map) return res.send('No map found with that ID.');
        RESULT = map;
	  app.expose(RESULT, "RESULT");
	  res.render("home");
    })
})

app.get("/", function(req, res) {
	RESULT = -1;
	app.expose(RESULT, "RESULT");
	res.render("home");
});

app.listen(PORT, function() {
    console.log('App listening on port:', PORT);
})
