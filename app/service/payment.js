'use strict';
const Service = require('egg').Service;
const moment = require('moment');

class PaymentService extends Service {

    getPaymentOrderId() {
        return "PAYMENT_ORDER_ID"
    };

    //生产订单
    async create(mongodb, newOrder) {
        const {
            ctx,
            service,
            app
        } = this;
        //await ctx.model.paymentOrder.create(newOrder);

        let order = await mongodb.create(newOrder);

        return order;
    }

    //查询
    //let info = await mongodb.find({ uid: uid, order_status: OrderStatus["notArrived"] }); //查询是否有等待支付的订单
    async query(mongodb, jsonQuery) {
        const {
            ctx,
            service,
            app
        } = this;

        let objResult = await mongodb.find(jsonQuery);

        return objResult;
    }

    //修改
    // async update(mongodb, _order_id, _jsonUpdate) {
    //     const {
    //         ctx,
    //         service,
    //         app
    //     } = this;

    //     let objResult = await mongodb.update({
    //         _id: _order_id
    //     }, {
    //         $set: _jsonUpdate
    //     });

    //     return objResult;
    // }
    async update(mongodb, _json_condition, _jsonUpdate) {
        const {
            ctx,
            service,
            app
        } = this;

        let objResult = await mongodb.update(
            _json_condition , {
            $set: _jsonUpdate
        });

        return objResult;
    }


    async queryList(mongodb, _json_condition, _jsonSort, _nLimit){
        const {
            ctx,
            service,
            app
        } = this;

        let objResult = await mongodb.find(_json_condition).sort(_jsonSort).limit(_nLimit);

        return objResult;

    }

    //加资产
    //用户ID  增加的资产金额  资产类型  充值平台来源    公司订单号  平台订单号
    async addZiChan(_uid, _add_amount, _coin_type, _source, _company_order_no, _trade_no) {
        const {
            ctx,
            service,
            app
        } = this;
        let config = this.config.w100Payment.client;
        let redis = this.ctx.app.redis;
        //生成weexid  需要此处用来计数吗？
        let weexOrderId = await redis.incr(this.getPaymentOrderId());
        //组建weex订单信息
        let weexParam = {
            "balance_id": weexOrderId,
            "user_id": _uid, //arg.morder_name,
            "amount": _add_amount, //arg.morder_price,
            "detail": {
                "source": _source,
                "scompany_order_no": _company_order_no,
                "trade_no": _trade_no,
                //w100_order_id: 456,//arg.morder_id
            },
            "business": "deposit",
            "coin_type": _coin_type, //"USD",
            "access_id": config.weex.access_id //共用这个参数会对之前的有影响吗？
        };
        let weexRes = await ctx.helper.sendWeexReq(config.weex, weexParam);
        if (weexRes == null ||
            weexRes.code != 0) {
            //await redis.del(getLockKey(arg.morder_name));
            app.logger.error("[payment.addZiChan] weex 响应失败", this.ctx.arg, weexRes);
            let logdb = this.ctx.model.MessageLogs;
            await logdb.create({
                create_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
                message_type: "exception",
                uid: _uid, //arg.morder_name,
                key: "",
                info: "(dora)用户:" + _uid +
                    ", 回调失败，因为weex返回异常 订单id为" +
                    _company_order_no + ", 平台交易订单号" + _trade_no + ", weex返回" +
                    (weexRes == null ? "null" : JSON.stringify(weexRes)),
                send_flag: false,
            });
            return "核心返回异常";
        }
        app.logger.info("[payment.addZiChan] weex 返回", this.ctx.arg, weexParam, weexRes);

        return 0;
    }


}

module.exports = PaymentService;