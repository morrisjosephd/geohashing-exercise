const request = require('request');
const moment = require('moment');
const crypto = require('crypto');
const dowCacheService = require('./services/dowCacheService');

const url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
const today = moment().format("YYYY-MM-DD");

module.exports = function(lat, lon, cb) {

  dowCacheService.getDowCache(function(err, cache) {
    var encryptedData;
    var newCoordinates;

    if (cache !== undefined) {
      encryptedData = encryptData(cache);
      newCoordinates = buildCoordinates(lat, lon, encryptedData);
      cb(newCoordinates);
    } else {
      getDowOpenValue()
        .then(function(data) {
          dowCacheService.createDowCache(today, data, function() {});
          encryptedData = encryptData(data);
          newCoordinates = buildCoordinates(lat, lon, encryptedData);
          cb(newCoordinates);
        });
    }
  });
};

function getDowOpenValue () {
  return new Promise(function(fulfill, reject) {
    request(url, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        var dowOpenValue = JSON.parse(body).query.results.quote[0].Open;
        fulfill(dowOpenValue);
      }
    });
  });
}

function encryptData (dow) {
  var hash = crypto.createHash('md5');
  hash.update(`${today}-${dow}`);
  return hash.digest('hex');
}

function buildCoordinates (lat, lon, data) {
  var obj = {};

  obj.newLat = lat.split('.')[0] + '.' + (hexToDecimal(data.substr(0, 16)).toString()).split('.')[1];
  obj.newLon = lon.split('.')[0] + '.' + (hexToDecimal(data.substr(16)).toString()).split('.')[1];

  return obj;
}

function hexToDecimal (data) {
  var parsedData = 0;

  for (var i = 1; i <= 16; i++) {
    parsedData += parseInt(data.substr(16 - i, 1), 16);
    parsedData /= 16;
  }

  return parsedData;
}
