var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

// Load envirorment variables
dotenv.load();

// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB, function(err) {
    if (err) {
        throw err;
        process.exit(1);
    }
});

var mapSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    }
    // comment: {
    //     type: String,
    //     required: true
    // },   // REMEMBER COMMA
    // assigned: {
    //     type: String,
    //     required: true
    // }
},
{ collection: 'random_maps' }
);

var Map = mongoose.model('Map', mapSchema);

// var logger = require('morgan');
var exphbs = require('express-handlebars');
var expstate = require('express-state');
var app = express();
var PORT = 3000;

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
    // // catches emission from client side
    // socket.on('save', function(obj) {
    //     // finds map, alters data, saves
    //     Map.findOne({ _id: id}, function(err, m) {
    //       if (err) throw err;
    //       if (!m) return res.send('No map found with that ID.');
    //       if (typeof(obj) != 'string') console.log("well, shit");
    //       m.data = obj;
    //       m.save(function(err) {
    //         if (err) throw err;
    //         console.log("Successfully altered map");
    //       });
    //     });
    // });

    // socket.on('create new map', function(obj) {
    //     var newMap = new Map ({
    //         data: "[{\"x\":462,\"y\":50,\"data\":\"Enter your TAXT here\",\"depth\":0,\"parent\":null,\"id\":1,\"children\":[],\"toggle\":0,\"textsize\":131.68972778320312,\"subtreeWidth\":151.68972778320312,\"width\":151.68972778320312}]"
    //      });
    //     newMap.save(function(err) {
    //         if (err) throw err;
    //         // send to client for redirect
    //         socket.emit('created', newMap._id);
    //         console.log('new id is: '+ newMap._id);
    //     })
    //  })
});

var RESULT;

app.get('/maps/:id', function(req, res) {
    console.log("id is: " + req.params.id);
    Map.findOne({ _id: req.params.id}, function(err, m) {
        if (err) throw err;
        if (!m) {
            console.log('No map found with that ID.');
            res.send("Sorry!  No map found with that ID.");
            return;
        }
        var uniqueId = req.params.id; // set id for later saving and such
        RESULT = m;
        app.expose(RESULT, "RESULT");
        app.expose(uniqueId, "uniqueId");
        res.render("home");
    })
    //  var newMap = new Map ({


    //     // ----------------------------------  DEAR MATT: YOUR QUOTE HERE------------------------------
    //     data: "[{\"x\":724,\"y\":50,\"connection\":\"line\",\"data\":\"\",\"depth\":0,\"parent\":null,\"id\":0,\"children\":[{\"x\":724,\"y\":150,\"connection\":\"neoroot\",\"data\":\"Enter your text here.\",\"depth\":1,\"parent\":null,\"id\":1,\"children\":[],\"toggle\":0,\"textsize\":135.90087890625,\"subtreeWidth\":155.90087890625,\"width\":155.90087890625}],\"toggle\":0,\"textsize\":0,\"subtreeWidth\":155.90087890625,\"width\":20}]"
    //     //
    // });
    // RESULT = newMap;
    // app.expose(RESULT, "RESULT");
    // res.render("home");
})

// app.post('/requests', function(req, res) {
//     else if (req.body.type == "create") {
//         console.log("creating!!!");
//         // res.
//         // res.datacreateNewMap());
//     }
// });

app.post('/maps/:id', function(req, res) {
     if (req.body.type == "save") {
        Map.findOne({ _id: req.body.id}, function(err, m) {
            if (err) throw err;
            if (!m) {
                console.log('No map found with that ID.');
                res.send("Sorry!  No map found with that ID.");
                return;
            }
            m.data = req.body.data;
            m.save(function(err) {
                if (err) throw err;
                console.log("Successfully altered map");
            });
                console.log("Successfully saved map");
            });
        }

    else if (req.body.type == "create") {
        console.log("MY CREATE POST !!!");
        var newUrl = createNewMap();
        console.log("Successfully created map");
        // redirect is in client portion b/c of ajax post request
        res.send({redirect: newUrl});
    }

    else console.log("req.body.type should be 'save' or 'create'. req.body: " + req.body);
});

// returns newURL
function createNewMap() {
    var newMap = new Map ({
            // NOTE: if you ever need to get an updated version of this "starter json" just go into whatever test page you have and in the dev. console type saveToJSON(root) and it will give it to you
            data: "[{\"x\":724,\"y\":50,\"connection\":\"line\",\"data\":\"\",\"depth\":0,\"parent\":null,\"id\":0,\"children\":[{\"x\":724,\"y\":150,\"connection\":\"neoroot\",\"data\":\"Enter your text here.\",\"depth\":1,\"parent\":null,\"id\":1,\"children\":[],\"toggle\":0,\"textsize\":135.90087890625,\"subtreeWidth\":155.90087890625,\"width\":155.90087890625}],\"toggle\":0,\"textsize\":0,\"subtreeWidth\":155.90087890625,\"width\":20}]"
         });
        newMap.save(function(err) {
            if (err) throw err;
        })
        var newURL = ('/maps/' + newMap._id);
        console.log('new URL is: ' + newURL);
        return newURL;
}

app.get('/create', function(req, res) {
        res.redirect(createNewMap());
})


app.get("/", function(req, res) {
    // RESULT = -1;
    // app.expose(RESULT, "RESULT");
    // res.render("home");
    res.sendFile("/index.html", { root: __dirname + '/site'});
});


http.listen(PORT, function() {
    console.log('App listening on port:', PORT);
})
