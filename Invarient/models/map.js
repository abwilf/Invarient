const mongoose = require('mongoose');


var mapSchema = new mongoose.Schema(
{
    data: {
        type: String,
        required: true
    }
},
{ 
    collection: 'maps' 
}
);

var Map = mongoose.model('Map', mapSchema);
module.exports = Map;
