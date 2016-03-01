const request = require('request');
const moment = require('moment');
const crypto = require('crypto');
const dowCacheService = require('./services/dowCacheService');

const url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
//const today = moment().format("YYYY-MM-DD");
const today = moment().month(4).date(26).year(2005).format("YYYY-MM-DD");


module.exports = function(lat, lon, cb) {

  dowCacheService.getDowCache(function(err, cache) {
    if (cache !== undefined) {
      encryptData(cache.dowOpen, function(data) {
        cb(data);
      });
    } else {
      getDowOpenValue()
        .then(function(data) {
          dowCacheService.createDowCache(today, data, function(err, success){});
          encryptData(data, function(data) {
            cb(data);
          });
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
        //var dowOpenValue = JSON.parse(body).query.results.quote[0].Open;
        var dowOpenValue = 10458.68;
        fulfill(dowOpenValue);
      }
    });
  });
}

function encryptData (dow, cb) {
  var obj = {};

  var hash = crypto.createHash('md5');
  hash.update(`${today}-${dow}`);
  obj.dowOpenValue = dow;
  obj.hashedData = hash.digest('hex');
  obj.date = today;
  cb(obj);
}
