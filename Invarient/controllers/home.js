/**
 * GET /
 * Home page.
 */
const Map = require('../models/Map');
const User = require('../models/User');
var async = require('async');

exports.index = (req, res) => {
   // passport native func
  if (req.isAuthenticated()) {
    console.log('maps length: ' + res.locals.user.maps.length)

    // populate mapIds arr
    var mapIds = [];
    for (var i = 0; i < res.locals.user.maps.length; ++i) {
      console.log('i IS: ' + i);
      // console.log('TITLE IS: ' + res.locals.user.maps[i].title);

      var mapId = res.locals.user.maps[i].mapId;
      mapIds.push(mapId);
      // console.log('MAP ID IS: ' + mapId);
    }

    // console.log('ONE');
    // res.locals.user.maps.forEach((element, index) => {
    //   console.log(element);
    // })
    async.waterfall([
    // populate maps arr
    function(next) {
      Map.find().where('_id').in(mapIds).exec(next);
    },
    function(maps, next) {
      maps.forEach(function(map, index) {
        res.locals.user.maps.forEach(function(element, index) {
          if (element.mapId == map._id) {
            element.title = map.title;
            console.log('TITLE MATCHING: ' + element.title)
          }
        })
      })
      next()
    },
    function() {
    console.log('TWO');
    res.locals.user.maps.forEach((element, index) => {
      console.log(element);
    })
    res.render('account/userspace', {
      title: 'Invarient',
      headerType: 'logged'
      // NOTE: res.locals.user is passed here too
    });
    }
    ]);
    
    


    
  }
  else {
    res.render('home', {
      title: 'Invarient',
      headerType: 'notLogged'
    });
  }
};
