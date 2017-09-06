const mongoose = require('mongoose');


var mapSchema = new mongoose.Schema(
{
    data: {
        type: String,
        required: true
    },
    userEmail: {
    	type: String,
    	required: true
    },
    otherUsers: { 
    	type: Array, 
    	required: false 
    }
},
{ 
    collection: 'mapsUser' 
}
);

var Map = mongoose.model('Map', mapSchema);
module.exports = Map;
