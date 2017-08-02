const mongoose = require('mongoose');


var mapSchema = new mongoose.Schema(
{
    data: {
        type: String,
        required: true
    }
},
{ 
    collection: 'random_maps' 
}
);

var Map = mongoose.model('Map', mapSchema);
module.exports = Map;
