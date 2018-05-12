'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class IndexController extends Controller {
    async ranking() {
        const { ctx, service, app } = this;
        ctx.helper.pre("ranking",
            {
                ver: { type: 'string' },
                source: { type: 'string' },
                uid: { type: 'string' },
                token: { type: 'string' }
            });
            
        const k0 = app.weexWs.get0Kline();
        const k1 = app.weexWs.get1Kline();

        const marketInfos = app.weexWs.getTodaySubscribe()["USD"];
        console.log(marketInfos,"===========");
        var t = [];
        var markets = Object.keys(marketInfos);
        for (var i = 0; i < markets.length; i++) {
            let market = marketInfos[markets[i]];
            t.push(market);
        }
        console.log(t);
        let d = _.orderBy(t, ['priceChangePercent'], ['desc']); 

        let res = {
            rise: [],
            fall: []
        };
        for (var i = 0; i < d.length; i++) {
            if (d[i].priceChangePercent.indexOf("-") < 0) {
                res.rise.push(d[i]);
            } else {
                res.fall.push(d[i]);
            }

        }

        ctx.body = {
            code: 0,
            data: res,
            message: "OK",
        };
        ctx.helper.end("ranking");
    }
    makeVal(v1, v2) {
        if (i++ % 2 == 0) {
            return {
                priceChange: "$" + Math.abs((v1 - v2).toFixed(2)),
                priceChangePercent: "-" + ((v1 - v2) / v2).toFixed(2) + "%"
            }
        }
        return {
            priceChange: "$" + Math.abs((v1 - v2).toFixed(2)),
            priceChangePercent: ((v1 - v2) / v2).toFixed(2) + "%"
        }
    }
}

var i = 0;
module.exports = IndexController;
