'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class ConfigController extends Controller {
    /**
     * 充值
     */
    async recharge() {
        const { ctx, service, app } = this;
        ctx.helper.pre("recharge", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            recharge_type: { type: 'string' },
            recharge_amount: { type: 'number' },
        });

        var result = await ctx.app.w100Payment.depositReqByCoinsDo(ctx.app.redis,
            ctx.model.CoinsDoOrder,
            {
                uid: ctx.arg.uid,
                amount: ctx.arg.recharge_amount,
            });
        let res = Object.assign({}, result.data);
        if (result.code == 1000) {
            res.amount = ctx.arg.recharge_amount;
        }

        ctx.body = {
            code: result.code,
            data: res,
            message: result.code != 1000 ? "error" : "OK",
        };
        ctx.helper.end("recharge");
    }

    async getOrderStatus() {
        const { ctx, service, app } = this;
        ctx.helper.pre("recharge", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            order_id: { type: 'string' },
        });

        var result = await ctx.app.w100Payment.getOrderReqByCoinsDo(ctx.app.redis,
            ctx.model.CoinsDoOrder,
            {
                orderId: ctx.arg.order_id,
            }, function (err) {
                ctx.logger.info("depositReqByDora Ok");
            });

        ctx.body = {
            code: result == null ? 1001 : 1000,
            data: result == null ? null : result,
            message: result == null ? "error" : "OK",
        };
        console.log(ctx.body);
    }

    async setOrderStatus() {
        const { ctx, service, app } = this;
        ctx.helper.pre("recharge", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            order_id: { type: 'string' },
        });

        var result = await ctx.app.w100Payment.setOrderStatusByCoinsDo(ctx.app.redis,
            ctx.model.CoinsDoOrder,
            {
                uid: ctx.arg.uid,
                orderId: ctx.arg.order_id,
            }, function (err) {
                ctx.logger.info("setOrderStatusByCoinsDo Ok");
            });

        ctx.body = {
            code: result.code == null ? 1001 : 1000,
            data: result.data == null ? null : result.data,
            message: result == null ? "error" : "OK",
        };
        console.log(ctx.body);
    }

    async getOrderList() {
        const { ctx, service, app } = this;
        ctx.helper.pre("recharge", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
        });

        var results = await ctx.app.w100Payment.getOrderListByCoinsDo(ctx.app.redis,
            ctx.model.CoinsDoOrder,
            {
                uid: ctx.arg.uid,
            }, function (err) {
                ctx.logger.info("setOrderStatusByCoinsDo Ok");
            });

        ctx.body = {
            code: 1000,
            data: results,
            message: results == null ? "error" : "OK",
        };
        console.log(ctx.body);
    }

    /**
    * 回调
    */
    async callback() {
        const { ctx, service, app } = this;
        ctx.helper.pre("callback", {
        });

        console.log(ctx.arg, 'callback---------------------');

        var results = await ctx.app.w100Payment.callbackByCoinsDo(ctx.app.redis,
            ctx.model.CoinsDoOrder,
            ctx.arg);
        ctx.body = results;

    }

}

module.exports = ConfigController;
