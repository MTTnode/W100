'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");
const moment = require("moment");

class MarketwarnController extends Controller {

  async addMarketwarn() {
    const { ctx, service, app } = this;
    if(ctx.request.body._id){
      ctx.helper.pre("editTradewarn", {
        _id: { type: 'string' },
        flag: { type: 'string' },
        market: { type: 'string' }
      });
      let day = moment().format("YYYY-MM-DD");
      let uid = ctx.arg.uid;
      let market = ctx.arg.market;
      app.redis.get('JPush_upprice_' + day + market + uid).then(val => {
        app.redis.del('JPush_upprice_' + day + market + uid);
      });
      app.redis.get('JPush_downprice_' + day + market + uid).then(val => {
        app.redis.del('JPush_downprice_' + day + market + uid);
      });
    }else{
      ctx.helper.pre("addTradewarn", {
        market: { type: 'string' },
        flag: { type: 'string' }
      });
    }
    if(ctx.arg.upprice || ctx.arg.downprice){
      let params = {};
      params.market = ctx.arg.market;
      if(ctx.arg.upprice){
        params.upprice = ctx.arg.upprice;
      }else{
        params.upprice = ctx.arg.upprice;
      }
      if(ctx.arg.downprice){
        params.downprice = ctx.arg.downprice;
      }else{
        params.downprice = ctx.arg.downprice;
      }
      params.flag = ctx.arg.flag;
      params.uid = ctx.arg.uid;
      params.token = ctx.arg.token;
      if(ctx.arg._id){
        params._id = ctx.arg._id;
      }
      ctx.body = await service.marketwarn.addMarketwarn(params);
    }else{
      ctx.body = {
        code: -1,
        data: null,
        message: "请至少选择一个预警指标"
      }
    }
    if(ctx.request.body._id){
      ctx.helper.end("editTradewarn");
    }else{
      ctx.helper.end("addTradewarn");
    }
  }

  async getMarketwarn() {
    const { ctx, service, app } = this;
    ctx.helper.pre("getMarketwarn", {
      _id: { type: 'string' }
    });
    let params = {};
    params._id = ctx.arg._id;
    ctx.body = await service.marketwarn.getMarketwarn(params);
    ctx.helper.end("getMarketwarn");
  }

  async getMarketwarnList() {
    const { ctx, service, app } = this;
    ctx.helper.pre("getMarketwarnList", {
    });
    let params = {};
    params.uid = ctx.arg.uid;
    ctx.body = await service.marketwarn.getMarketwarnList(params);
    ctx.helper.end("getMarketwarnList");
  }

  async delMarketwarn() {
    const { ctx, service, app } = this;
    ctx.helper.pre("delMarketwarn", {
      _id: { type: 'string' },
      market: { type: 'string' }
    });
    let day = moment().format("YYYY-MM-DD");
    let params = {};
    params._id = ctx.arg._id;
    let uid = ctx.arg.uid;
    let market = ctx.arg.market;
    app.redis.get('JPush_upprice_' + day + market + uid).then(val => {
      app.redis.del('JPush_upprice_' + day + market + uid);
    });
    app.redis.get('JPush_downprice_' + day + market + uid).then(val => {
      app.redis.del('JPush_downprice_' + day + market + uid);
    });
    ctx.body = await service.marketwarn.delMarketwarn(params);
    ctx.helper.end("delMarketwarn");
  }

}

module.exports = MarketwarnController;
