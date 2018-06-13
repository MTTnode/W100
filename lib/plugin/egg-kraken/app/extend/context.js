'use strict';
const async = require("async");
const https = require('https');
const KrakenClient = require('./kraken.js');
const key = 'rPP59mviT4QIA2SXlqoW0F2K97eGhlHKYjc4V65lJhjN8PGtZAAupC8N'; // API Key
const secret = 'SZI9yDacaAszaHtSi9oOHQFy5AYnj7vgPgD2EgG/74+mY69hHUfxfmhA9KxRmtk2x0I07ckm7MLfVimu9lR57A=='; // API Private Key
const krakenItem = new KrakenClient(key, secret);

var val = {};

module.exports = {
  kraken: {
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
      console.log("egg-kraken.reset24hrticker begin");
      var _this = this;
      async.each(markets, function(market, callback) {
        try { 
          krakenItem.api('Ticker', { pair : market }).then(function(ourRes){
            // console.log('-------------'+market+'-----------------');
            // console.log(ourRes.result);
            if(ourRes.error && ourRes.result){
              if (val[market] == null) {
                val[market] = {};
              }
              let _market = '';
              if(market == 'BCHUSD' || market == 'DASHUSD'){
                _market = market;
              }else{
                _market =  _this.getSymbol(market);
              }
              val[market].count = ourRes.result[_market].t[1];
              if(market == 'DOGEUSD'){
                val[market].lastPrice = ourRes.result[_market].c[0];
              }else{
                val[market].lastPrice = parseFloat(ourRes.result[_market].c[0]).toFixed(2);
              }
              val[market].priceChange = "$" + (parseFloat(ourRes.result[_market].c[0])-parseFloat(ourRes.result[_market].o)).toFixed(4);
              val[market].priceChangePercent = ((parseFloat(ourRes.result[_market].c[0])-parseFloat(ourRes.result[_market].o))/parseFloat(ourRes.result[_market].o)*100).toFixed(2) + '%';
            }
          });
        } catch (error) {
          console.log(error, market);
        }
        return callback();
      },function(err) {
        console.log("egg-kraken.reset24hrticker end");
        return fn();
      });
      // async.eachLimit(markets, 2, function (market, cb) {
        // let symbol = _this.getSymbol(market);
        // console.log('========================');
        // console.log(market);
      //   _this.request('https://data.gateio.io/api2/1/ticker/' + symbol,
      //     function (err, ourRes) {
      //       if (!err && ourRes.last) {
      //         if (val[market] == null) {
      //           val[market] = {};
      //         }
      //         val[market].count = ourRes.baseVolume;
      //         val[market].lastPrice = ourRes.last;
      //         val[market].priceChange = "$" + (parseFloat(ourRes.last)*parseFloat(ourRes.percentChange)/100);
      //         val[market].priceChangePercent = ourRes.percentChange + '%';
      //       }
      //       return cb();
      //     });
      // }, function (err) {
      //   console.log("egg-kraken.reset24hrticker end");
      //   return fn();
      // });
    },
    getSymbol(market) {
      return "X" + market.substr(0, market.length - 3) + 'Z' + market.substr(market.length - 3, market.length);
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