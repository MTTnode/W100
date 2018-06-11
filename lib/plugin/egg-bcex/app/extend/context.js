'use strict';
const async = require("async");
const https = require('https');
const querystring = require("querystring");
var val = {};

module.exports = {
  bcex: {
    request(symbol, fn) {
      let reqData = {
        part: 'ckusd',
        coin: symbol.toLowerCase()
      };
      let postData = querystring.stringify(reqData);
      let opts = {
        method: 'POST',
        host: 'www.bcex.ca',
        port: '443',
        path: '/Api_Market/getCoinTrade',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      }
      let _data = "";
      var req = https.request(opts, function (res) {
        res.on('data', function (d) {
          _data += d;
        })
        res.on('end', function () {
          _data = JSON.parse(_data);
          return fn(null, _data);
        })
      });
      req.on('error', function (e) {
        console.error("egg-bcex.request error", symbol, e);
        return fn(true);
      });
      req.write(postData);
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
      console.log("egg-bcex.reset24hrticker begin");
      let _this = this;
      async.eachLimit(markets, 2, function (market, cb) {
        let symbol = _this.getSymbol(market);
        _this.request(symbol,
          function (err, ourRes) {
            if (!err && ourRes.price != 0) {
              if (val[market] == null) {
                val[market] = {};
              }
              val[market].count = ourRes.volume_24h;
              val[market].lastPrice = parseFloat(ourRes.price).toFixed(2);
              val[market].priceChange = "$" + (parseFloat(ourRes.price) * parseFloat(ourRes.change_24h)).toFixed(4);
              val[market].priceChangePercent = (parseFloat(ourRes.change_24h)*100).toFixed(2) + '%';
            }
            return cb();
          });
      }, function (err) {
        console.log("egg-bcex.reset24hrticker end");
        return fn();
      });
    },
    getSymbol(market) {
      return market.substr(0, market.length - 3);
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