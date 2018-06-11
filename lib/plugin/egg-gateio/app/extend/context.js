'use strict';
const async = require("async");
const https = require('https');
var val = {};

module.exports = {
  gateio: {
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
            console.log("egg-gateio.request parse json error", url, error, _data);
            return fn(true);
          }
        });
      }).on('error', (e) => {
        console.error("egg-gateio.request error", url, e);
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
      console.log("egg-gateio.reset24hrticker begin");
      let _this = this;
      async.eachLimit(markets, 2, function (market, cb) {
        let symbol = _this.getSymbol(market);
        _this.request('https://data.gateio.io/api2/1/ticker/' + symbol,
          function (err, ourRes) {
            if (!err && ourRes.last) {
              if (val[market] == null) {
                val[market] = {};
              }
              val[market].count = ourRes.baseVolume;
              if(market == 'DOGEUSD'){
                val[market].lastPrice = parseFloat(ourRes.last);
              }else{
                val[market].lastPrice = parseFloat(ourRes.last).toFixed(2);
              }
              val[market].priceChange = "$" + (parseFloat(ourRes.last)*parseFloat(ourRes.percentChange)/100).toFixed(4);
              val[market].priceChangePercent = parseFloat(ourRes.percentChange).toFixed(2) + '%';
            }
            return cb();
          });
      }, function (err) {
        console.log("egg-gateio.reset24hrticker end");
        return fn();
      });
    },
    getSymbol(market) {
      return market.substr(0, market.length - 3) + "_" + market.substr(market.length - 3, market.length) + "T";
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