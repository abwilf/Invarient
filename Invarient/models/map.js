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
    otherUsers: [{
        email: String,
        permission: String
    }]
},
{ 
    collection: 'mapsUser' 
}
);

var Map = mongoose.model('Map', mapSchema);
module.exports = Map;
