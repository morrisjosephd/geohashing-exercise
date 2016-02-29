var express = require('express');
var app = express();

var geoHash = require('./lib/geohash');

app.get('/geohash', function (req, res) {
  var lat = req.query.lat;
  var lon = req.query.lon;

  console.log(lat, lon);

  var respond = function (data) {
    res.status(200).type('json').json(data);
  };

  geoHash(lat, lon, respond);

});


console.log("api listening on 8000");

app.listen(8000);

module.exports = app;
