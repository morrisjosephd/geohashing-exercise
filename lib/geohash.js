const request = require('request');
const moment = require('moment');
const crypto = require('crypto');
//const dowCacheService = require('./services/dowCacheService');

const url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
//const today = moment().format("YYYY-MM-DD");
const today = moment().month(4).date(26).year(2005).format("YYYY-MM-DD");


module.exports = function(lat, lon, cb) {
  var returnObject = {};

  getDowOpenValue(function (data) {
    returnObject.dowOpenValue = data.dowOpenValue;
    returnObject.date = data.date;

    encryptData(data.dowOpenValue, today, function(data) {
      returnObject.hex = data.hashedData;
      cb(returnObject);
    });
  });
};

function getDowOpenValue (cb) {
  var obj = {};
  request(url, function(err, res, body) {
    var dowOpenValue = JSON.parse(body).query.results.quote[0].Open;
    obj.date = today;
    obj.dowOpenValue = dowOpenValue;
    cb(obj);
  });
}

function encryptData (dow, today, cb) {
  var obj = {};

  var hash = crypto.createHash('md5');
  hash.update(`${today}-${dow}`);
  obj.hashedData = hash.digest('hex');
  cb(obj);
}





  //var dowCacheResponse = function (err, success) {
  //  console.log('this is the reply from the callback: ' + success);
  //};
  //
  //if (dowCacheService.getDowCache() === undefined) {
  //  var dow = getDowOpen();
  //  dowCacheService.createDowCache(today, dow, dowCacheResponse);
  //}

  //function getDowOpen() {
  //  request(url, function(err, res, body) {
  //    dowOpen = JSON.parse(body).query.results.quote[0].Open;
  //    console.log('dowOpen from getDowOpen: ' + dowOpen);
  //  });
  //  cb(dowOpen)
  //}
  //
  //var hash = crypto.createHash('md5');
  //hash.update(`${today}-${dowOpen}`);
  //var hashedData = hash.digest('hex');
  //
  //var leftHash = hashedData.substr(0, 16);
  //var rightHash = hashedData.substr(16);
  //
  //var l_toDecimal = parseInt(leftHash, 16) / 100;
  //var r_toDecimal = parseInt(rightHash, 16) / 100;
  //
  //var jsonResponse = {
  //  today: today,
  //  dowOpen: dowOpen,
  //  hashedData: hashedData,
  //  l_Hash: leftHash,
  //  r_Hash: rightHash,
  //  l_toDecimal: l_toDecimal,
  //  r_toDecimal: r_toDecimal
  //};
  //
  //cb(jsonResponse);




  //request(url, function(err, resp, body) {
  //
  //  //var dowOpen = JSON.parse(body).query.results.quote[0].Open;
  //  ////var dowOpen = 10458.68;
  //  //var hash = crypto.createHash('md5');
  //  //hash.update(`${today}-${dowOpen}`);
  //  //var hashedData = hash.digest('hex');
  //
  //  var leftHash = hashedData.substr(0, 16);
  //  var rightHash = hashedData.substr(16);
  //
  //  var l_toDecimal = parseInt(leftHash, 16) / 100;
  //  var r_toDecimal = parseInt(rightHash, 16) / 100;
  //
  //
  //
  //  var jsonResponse = {
  //    hashedData: hashedData,
  //    l_Hash: leftHash,
  //    r_Hash: rightHash,
  //    l_toDecimal: l_toDecimal,
  //    r_toDecimal: r_toDecimal
  //  };
  //
  //  cb(jsonResponse);
  //});

//  getDowOpen();
//
//};
//

