const NodeCache = require('node-cache');

var dowCache = new NodeCache({stdTTL: 10, checkperiod: 15});

module.exports.getDowCache = function (cb) {
  dowCache.get('dailyDowCache', function(err, cache) {
    if (err) {
      console.log('Error! getDowCache: ' + err);
    }
    cb(null, cache);
  });
};

module.exports.createDowCache = function (date, dowOpen, cb) {
  var dowCacheObject = {
    date: date,
    dowOpen: dowOpen
  };

  dowCache.set("dailyDowCache", dowCacheObject, function(err, success) {
    if(!err && success) {
      cb(null, success);
    }
  });
};
