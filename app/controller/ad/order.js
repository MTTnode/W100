'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");
const moment = require("moment");

class OrderController extends Controller {
    async orderList() {
        const { ctx, service, app } = this;
        ctx.helper.pre("orderList", {
        });
        let param = {};

        if(ctx.query.order_number){
          param.order_number = ctx.query.order_number;
        }
        if(ctx.query.user){
          param.uid = ctx.query.user;
        }
        if(ctx.query.order_status){
          param.order_status = ctx.query.order_status;
        }
        let date1 = parseFloat(new Date(ctx.query.time1+' 00:00:00:00').getTime());
        let date2 = parseFloat(new Date(ctx.query.time2+' 24:00:00:00').getTime());
        
        if(ctx.query.time1 && ctx.query.time2){
          param.create_time = {'$lte': date2, '$gte': date1};
        }
        let data = await ctx.model.CoinsDoOrder.find(param).sort({ create_time: -1 });
        let res = {};
        res.list = data;
        res.total = data.length;
        let total_price = 0;  //总价
        let account_paid = 0; //支付完成
        let revoke = 0; //主动撤销
        let revoke1 = 0;  //被动撤销
        let unpaid = 0; //未支付
        let partpaid = 0; //部分支付
        let confirmedpaid = 0; // 足额待确认

        data.forEach(element => {
          if(element.price){
            total_price += parseInt(element.price);
          }
          if(element.order_status && element.order_status == 10){
            account_paid += parseInt(element.price);
          }
          if(element.order_status && element.order_status == 20){
            revoke += parseInt(element.price);
          }
          if(element.order_status && element.order_status == 21){
            revoke1 += parseInt(element.price);
          }
          if(element.order_status && element.order_status == 1){
            unpaid += parseInt(element.price);
          }
          if(element.order_status && element.order_status == 2){
            partpaid += parseFloat(element.coin_cfmed);
          }
          if(element.order_status && element.order_status == 3){
            confirmedpaid += parseFloat(element.price);
          }
        });
        res.price = total_price;
        res.account_paid = account_paid;
        res.revoke = revoke;
        res.revoke1 = revoke1;
        res.unpaid = unpaid;
        res.partpaid = partpaid;
        res.confirmedpaid = confirmedpaid;

        ctx.body = {
          code: 0,
          message: 'OK',
          data: res
        };

        ctx.helper.end("orderList");
    }

}

module.exports = OrderController;
