const NodeCache = require('node-cache');

var dowCache = new NodeCache({stdTTL: 10, checkperiod: 3600});


module.exports.getDowCache = function () {
  dowCache.get('dailyDowCache', function(err, cache) {
    return cache;
  });
};

module.exports.createDowCache = function (date, dowOpen, cb) {
  var dowCacheObject = {
    date: date,
    dowOpen: dowOpen
  };

  dowCache.set("dailyDowCache", dowCacheObject, function(err, success) {
    if(!err && success) {
      console.log("Daily DOW cache created: " + success);
      cb(null, success);
    }
  });
};



