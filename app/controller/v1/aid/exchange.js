'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class ExchangeController extends Controller {
    async quot() {
        const { ctx, service, app } = this;
        ctx.helper.pre("quot", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
        });

        var data = [
            {
                exchage: "币安",
                data: ctx.bian.get24hr()
            }, {
                exchage: "火币",
                data: ctx.huobi.get24hr()
            }, {
                exchage: "OKEx",
                data: ctx.okex.get24hr()
            }, {
                exchage: "ZB",
                data: ctx.ZB.get24hr()
            },
        ]

        ctx.body = {
            code: 0,
            data: data,
            message: "OK",
        };
        ctx.helper.end("quot");
    }
}

module.exports = ExchangeController;
