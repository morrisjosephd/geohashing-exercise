const NodeCache = require('node-cache');

var dowCache = new NodeCache({stdTTL: 86400, checkperiod: 3600});

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
