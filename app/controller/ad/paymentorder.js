'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");
const moment = require("moment");

class PaymentOrderController extends Controller {
  async orderList() {
    const {
      ctx,
      service,
      app
    } = this;
    ctx.helper.pre("orderList", {});
    let param = {};

    if (ctx.query.order_number) {
      param.order_number = ctx.query.order_number;
    }
    if (ctx.query.user) {
      param.uid = ctx.query.user;
    }
    if (ctx.query.order_status) {
      param.order_status = ctx.query.order_status;
    }
    let date1 = parseFloat(new Date(ctx.query.time1 + ' 00:00:00:00').getTime());
    let date2 = parseFloat(new Date(ctx.query.time2 + ' 24:00:00:00').getTime());

    if (ctx.query.time1 && ctx.query.time2) {
      param.create_time = {
        '$lte': date2,
        '$gte': date1
      };
    }

    //默认dora支付
    param.platform = 'dora';
    let data = await ctx.model.PaymentOrder.find(param).sort({
      create_time: -1
    });
    let res = {};
    let list = [];

    res.total = data.length;
    let total_price = 0;  //总价
    let account_paid = 0; //支付完成
    let unpaid = 0; //未支付

    data.forEach((element, index) => {
      let obj = {};
      obj.create_time = element.create_time;
      obj.uid = element.uid;
      obj.order_status = element.order_status;
      obj.amount = element.amount;
      obj.order_number = element.order_number;
      obj.exchange_rate = element.exchange_rate;
      if(element.amount){
        total_price += parseInt(element.amount);
      }
      if(element.actual_amount){
        obj.actual_amount = element.actual_amount;
        obj.poundage = ((parseFloat(element.actual_amount)*parseFloat(element.amount_fee))/100).toFixed(4);
      }
      if(element.actual_amount_usd){
        obj.actual_amount_usd = parseFloat(element.actual_amount_usd).toFixed(4);
      }
      if(element.order_status == 10 || element.order_status == 2){
        account_paid += parseFloat(element.actual_amount);
      }
      list.push(obj);
    });
    res.list = list;
    res.price = total_price;
    res.account_paid = account_paid;
    res.unpaid = parseFloat(total_price)-parseFloat(account_paid);

    ctx.body = {
      code: 0,
      message: 'OK',
      data: res
    };

    ctx.helper.end("orderList");
  }

}

module.exports = PaymentOrderController;