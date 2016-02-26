const request = require('request');
const moment = require('moment');
const crypto = require('crypto');

const url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
const today = moment().format("YYYY-MM-DD");

module.exports = function(lat, lon, cb) {

  request(url, function(err, resp, body) {

    var dowOpen = JSON.parse(body).query.results.quote[0].Open;
    var hash = crypto.createHash('md5');
    hash.update(`${today}-${dowOpen}`);
    var hashedData = hash.digest('hex');

    cb(hashedData);
  });

  var jsonResonse = {
    lat: 37.421542,
    lon: -122.085589
  };

};