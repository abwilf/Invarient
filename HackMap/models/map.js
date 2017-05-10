var mongoose = require('mongoose');

// var reviewSchema = new mongoose.Schema({
//     rating: {
//         type: Number,
//         min: 0.0,
//         max: 5.0,
//         required: true
//     },
//     comment: {
//         type: String
//     },
//     author: {
//         type: String,
//         required: true
//     }
// });

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

var map = mongoose.model('map', mapSchema);

module.exports = map;
