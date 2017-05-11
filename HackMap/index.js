var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Map = require('./models/Map');
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

// for web socket
var http = require('http').Server(app);
var io = require('socket.io')(http);
var id; // will come from app.get /:id


io.on('connection', function(socket) {
    // catches emission from client side
    socket.on('save', function(obj) { 
        // finds map, alters data, saves
        Map.findOne({ _id: id}, function(err, m) {
          if (err) throw err;
          if (!m) return res.send('No map found with that ID.');
          if (typeof(obj) != 'string') console.log("well, shit");
          m.data = obj;
          m.save(function(err) {
            if (err) throw err;
            console.log("Successfully altered map");
          });
        });
    });
});

var RESULT;

app.get('/:id', function(req, res) {
    Map.findOne({ _id: req.params.id }, function(err, m) {
        if (err) throw err;
        if (!m) return res.send('No map found with that ID.');
        
        id = req.params.id; // set id for later saving and such
        RESULT = m;
        app.expose(RESULT, "RESULT");
        res.render("home");
    })
})

   // for altering map manually when dealing with saving
        // m.data = "[{\"x\":462,\"y\":50,\"data\":\"I am Root.\",\"depth\":0,\"parent\":null,\"id\":6,\"children\":[{\"x\":462,\"y\":150,\"data\":\"I'm a kid 2.\",\"depth\":1,\"parent\":null,\"id\":7,\"children\":[{\"x\":350.0126953125,\"y\":250,\"data\":\"I'm a niece.\",\"depth\":2,\"parent\":null,\"id\":8,\"children\":[{\"x\":280.642578125,\"y\":350,\"data\":\"I'm a Great-niece.\",\"depth\":3,\"parent\":null,\"id\":9,\"children\":[],\"toggle\":0,\"textsize\":118.740234375,\"subtreeWidth\":138.740234375,\"width\":138.740234375},{\"x\":419.3828125,\"y\":350,\"data\":\"I'm a Great-nephew.\",\"depth\":3,\"parent\":null,\"id\":10,\"children\":[],\"toggle\":0,\"textsize\":134.6044921875,\"subtreeWidth\":154.6044921875,\"width\":154.6044921875}],\"toggle\":0,\"textsize\":76.23046875,\"subtreeWidth\":293.3447265625,\"width\":96.23046875},{\"x\":573.9873046875,\"y\":250,\"data\":\"I'm a nephew.\",\"depth\":2,\"parent\":null,\"id\":11,\"children\":[],\"toggle\":0,\"textsize\":92.0947265625,\"subtreeWidth\":112.0947265625,\"width\":112.0947265625}],\"toggle\":0,\"textsize\":72.0556640625,\"subtreeWidth\":405.439453125,\"width\":92.0556640625}],\"toggle\":0,\"textsize\":69.19189453125,\"subtreeWidth\":405.439453125,\"width\":89.19189453125}]";
        // m.save(function(err) {
        //     if (err) throw err;
        //     res.send("Successfully altered map");
        //   });
        // console.log("m.data is: " + m.data);


app.get("/", function(req, res) {
    RESULT = -1;
    app.expose(RESULT, "RESULT");
    res.render("home");
});

app.post("/", function(req, res) {
    var map = new Map({data: "holla!"});
    map.save(function(err) {
        if (err) throw err;
        return res.send("Success!");
    });
})

http.listen(PORT, function() {
    console.log('App listening on port:', PORT);
})
