var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
// var Map = require('./models/Map');
var mapSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true
    // },
    // year: {
    //     type: Number,
    //     min: 0,
    //     max: 2017,
    //     required: true
    // },
    // genre: {
    //     type: String,
    //     required: true
    // },
    // reviews: [reviewSchema]
    data: {
        type: String,
        required: true
    }
});

var Map = mongoose.model('Map', mapSchema);

// var logger = require('morgan');
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
// app.use(logger('dev'));
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

    socket.on('create new map', function(obj) {
        var newMap = new Map ({
            data: "[{\"x\":462,\"y\":50,\"data\":\"Enter your text here\",\"depth\":0,\"parent\":null,\"id\":1,\"children\":[],\"toggle\":0,\"textsize\":131.68972778320312,\"subtreeWidth\":151.68972778320312,\"width\":151.68972778320312}]"
         });
        newMap.save(function(err) {
            if (err) throw err;
            // send to client for redirect
            socket.emit('created', newMap._id);
            console.log('new id is: '+ newMap._id);
        })
     })
});

var RESULT;

app.get('/:id', function(req, res) {
    // console.log("id is: " + req.params.id);
    // Map.findOne({ _id: req.params.id}, function(err, m) {
    //     if (err) throw err;
    //     if (!m) {
    //         console.log('No map found with that ID.');
    //         res.send("");
    //         return;
    //     }
    //     id = req.params.id; // set id for later saving and such
    //     RESULT = m;
    //     app.expose(RESULT, "RESULT");
    //     res.render("home");
    // })
    console.log("holla!");
     var newMap = new Map ({


        // ----------------------------------  DEAR MATT: YOUR QUOTE HERE------------------------------
        data: "[{\"x\":724,\"y\":50,\"connection\":\"line\",\"data\":\"\",\"depth\":0,\"parent\":null,\"id\":0,\"children\":[{\"x\":724,\"y\":150,\"connection\":\"neoroot\",\"data\":\"Enter your text here.\",\"depth\":1,\"parent\":null,\"id\":1,\"children\":[],\"toggle\":0,\"textsize\":135.90087890625,\"subtreeWidth\":155.90087890625,\"width\":155.90087890625}],\"toggle\":0,\"textsize\":0,\"subtreeWidth\":155.90087890625,\"width\":20}]"
        //
    });
    RESULT = newMap;
    app.expose(RESULT, "RESULT");
    res.render("home");
})

app.post('/:id', function(req, res) {

});

   // for altering map manually when dealing with saving
        // m.data = "[{\"x\":462,\"y\":50,\"data\":\"I am Root.\",\"depth\":0,\"parent\":null,\"id\":6,\"children\":[{\"x\":462,\"y\":150,\"data\":\"I'm a kid 2.\",\"depth\":1,\"parent\":null,\"id\":7,\"children\":[{\"x\":350.0126953125,\"y\":250,\"data\":\"I'm a niece.\",\"depth\":2,\"parent\":null,\"id\":8,\"children\":[{\"x\":280.642578125,\"y\":350,\"data\":\"I'm a Great-niece.\",\"depth\":3,\"parent\":null,\"id\":9,\"children\":[],\"toggle\":0,\"textsize\":118.740234375,\"subtreeWidth\":138.740234375,\"width\":138.740234375},{\"x\":419.3828125,\"y\":350,\"data\":\"I'm a Great-nephew.\",\"depth\":3,\"parent\":null,\"id\":10,\"children\":[],\"toggle\":0,\"textsize\":134.6044921875,\"subtreeWidth\":154.6044921875,\"width\":154.6044921875}],\"toggle\":0,\"textsize\":76.23046875,\"subtreeWidth\":293.3447265625,\"width\":96.23046875},{\"x\":573.9873046875,\"y\":250,\"data\":\"I'm a nephew.\",\"depth\":2,\"parent\":null,\"id\":11,\"children\":[],\"toggle\":0,\"textsize\":92.0947265625,\"subtreeWidth\":112.0947265625,\"width\":112.0947265625}],\"toggle\":0,\"textsize\":72.0556640625,\"subtreeWidth\":405.439453125,\"width\":92.0556640625}],\"toggle\":0,\"textsize\":69.19189453125,\"subtreeWidth\":405.439453125,\"width\":89.19189453125}]";
        // m.save(function(err) {
        //     if (err) throw err;
        //     res.send("Successfully altered map");
        //   });
        // console.log("m.data is: " + m.data);


app.get("/", function(req, res) {
    // RESULT = -1;
    // app.expose(RESULT, "RESULT");
    // res.render("home");
    res.sendFile("/index.html", { root: __dirname + '/site'});
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