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

        ctx.body = {
            code: result.code,
            data: result.data,
            message: result.code != 1000 ?"error":"OK",
        };
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

        return {
            "code": 1000,
            "data": {
                "order_ptime": "2018-04-08 14:17:43",
                "coin_rate": "8343.39",
                "coin_address": "ms8RToQRrDw6rGD8pxKSGCq9LjmKc3Q2XC",
                "coin_amount": "0.0013",
                "coin_wait": 0.0013,
                "coin_paid": "0",
                "coin_cfmed": "0",
                "valid_second": 50,
                "order_status": "1"
            },
            "message": "OK"
        }
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
    }


    /**
    * 回调
    */
    async callback() {
        const { ctx, service, app } = this;
        ctx.helper.pre("recharge", {
        });

        console.log(ctx.arg, 'callback---------------------');

        ctx.body = "success";

    }

}

module.exports = ConfigController;
