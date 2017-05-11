var mongoose = require('mongoose');

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

var Map = mongoose.model('map', mapSchema);

module.exports = Map;
