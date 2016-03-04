const request = require('request');
const moment = require('moment');
const crypto = require('crypto');
const dowCacheService = require('./services/dowCacheService');

const url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
const today = moment().format("YYYY-MM-DD");

module.exports = function(lat, lon, cb) {

  dowCacheService.getDowCache(function(err, cache) {
    if (cache !== undefined) {
      cb(encryptData(cache))
    } else {
      getDowOpenValue()
        .then(function(data) {
          dowCacheService.createDowCache(today, data, function() {});
          cb(encryptData(data));
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
