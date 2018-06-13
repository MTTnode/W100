
'use strict';
const async = require("async");
const https = require('https');
var val = {};

module.exports = {
    okex: {
        request(url, fn) {
            https.get(url, (res) => {
                var data = "";
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    data = JSON.parse(data);
                    return fn(null, data);
                });

            }).on('error', (e) => {
                console.error(e);
                return fn(true);
            });
        }, reset24hr(markets, fn) {
            let _this = this;
            async.series({
                s1: function (cb) {
                    _this.reset24hrticker(markets, cb);
                }, s2: function (cb) {
                    _this.reset24hrkline(markets, cb);
                }
            }, function (err) {
                return fn();
            });
        },
        reset24hrticker(markets, fn) {
            console.log("egg-okex.reset24hrticker begin");
            let _this = this;
            async.eachLimit(markets, 2, function (market, cb) {
                _this.request('https://www.okex.com/api/v1/ticker.do?symbol=' + _this.getSymbol(market),
                    function (err, ourRes) {
                        if (err || ourRes == null ||
                            ourRes.ticker == null) {
                            console.log("egg-okex.reset24hrticker error or outRes null", err, ourRes);
                            return cb();
                        }
                        if (val[market] == null) {
                            val[market] = {};
                        }
                        val[market].count = ourRes.ticker.vol;
                        if(market == 'DOGEUSD'){
                          val[market].lastPrice = ourRes.ticker.last;
                        }else{
                          val[market].lastPrice = parseFloat(ourRes.ticker.last).toFixed(2);
                        }

                        return cb();
                    });
            }, function (err) {
                console.log("egg-okex.reset24hrticker end");
                return fn();
            });
        }, reset24hrkline(markets, fn) {
            console.log("biegg-okex.reset24hrkline begin");
            let _this = this;
            async.eachLimit(markets, 2, function (market, cb) {
                _this.request('https://www.okex.com/api/v1/kline.do?symbol=' + _this.getSymbol(market) + '&type=1hour&since=' +
                    (new Date().getTime() - 
                    (1000 * 60 * 60 * 25)),
                    function (err, ourRes) {
                        try {
                            if (err || ourRes == null) {
                                console.log("egg-okex.reset24hrkline error", err);
                                return cb();
                            }
                            if (val[market] == null) {
                                val[market] = {};
                            }
                            let t = _this.getPriceChange(val[market].lastPrice, ourRes[0][1]);
                            val[market].priceChange = t.priceChange;
                            val[market].priceChangePercent = t.priceChangePercent;
                        } catch (error) {
                            console.log("egg-okex.reset24hrkline catch error", error);
                        }

                        return cb();
                    });
            }, function (err) {
                return fn();
                console.log("bian end");
            });
        },
        getPriceChange(v1, v2) {
            return {
                priceChange: "$" + Math.abs((v1 - v2).toFixed(4)),
                priceChangePercent: (((v1 - v2) / v2)*100).toFixed(2) + "%"
            }
        },
        getSymbol(market) {
            return market.substr(0, market.length - 3) + "_" + market.substr(market.length - 3, market.length) + "T";

        }, get24hr() {
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












