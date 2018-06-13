'use strict';
const async = require("async");
const https = require('https');
var val = {};

module.exports = {
  bitstamp: {
    request(url, fn) {
      https.get(url, (res) => {
        let _data = "";
        res.on('data', (d) => {
          _data += d;
        });
        res.on('end', () => {
          try {
            _data = JSON.parse(_data);
            return fn(null, _data);
          } catch (error) {
            // console.log("egg-bitstamp.request parse json error", url, error, _data);
            return fn(true);
          }
        });
      }).on('error', (e) => {
        // console.error("egg-bitstamp.request error", url, e);
        return fn(true);
      });
    },
    reset24hr(markets, fn) {
      let _this = this;
      async.series({
        s1: function (cb) {
          _this.reset24hrticker(markets, cb);
        }
      }, function (err) {
        return fn();
      });
    },
    reset24hrticker(markets, fn) {
      console.log("egg-bitstamp.reset24hrticker begin");
      let _this = this;
      async.eachLimit(markets, 2, function (market, cb) {
        _this.request('https://www.bitstamp.net/api/v2/ticker/' + market,
          function (err, ourRes) {
            if (!err && ourRes.last) {
              if (val[market] == null) {
                val[market] = {};
              }
              val[market].count = ourRes.volume;
              if(market == 'DOGEUSD'){
                val[market].lastPrice = ourRes.last;
              }else{
                val[market].lastPrice = parseFloat(ourRes.last).toFixed(2);
              }
              val[market].priceChange = "$" + (parseFloat(ourRes.last)-parseFloat(ourRes.open)).toFixed(4);
              val[market].priceChangePercent = ((parseFloat(ourRes.last)-parseFloat(ourRes.open))/parseFloat(ourRes.last)*100).toFixed(2) + '%';
            }
            return cb();
          });
      }, function (err) {
        console.log("egg-bitstamp.reset24hrticker end");
        return fn();
      });
    },
    get24hr() {
      let keys = Object.keys(val);
      let res = [];
      for (var i = 0; i < keys.length; i++) {
        let t = val[keys[i]]
        if (t.lastPrice == null ||
          t.priceChange == null ||
          t.priceChangePercent == null ||
          t.count == null) {
          continue;
        }
        t.symbol = keys[i];
        res.push(t);
      }
      return res;
    }
  }
};