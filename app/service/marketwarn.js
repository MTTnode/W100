'use strict';
const Service = require('egg').Service;

class UpdateService extends Service {
  
  async addMarketwarn(params) {
    const {ctx, service, app} = this;
    let json = await ctx.model.Marketwarn.find({uid: params.uid, market: params.market});
    if(json.length > 1){
      return {
        code: -1,
        data: null,
        message: "同一个交易对只能添加一个预警"
      };
    }
    let data = await ctx.model.Marketwarn.find({uid: params.uid});
    if(data.length >= 10){
      return {
        code: -1,
        data: null,
        message: "每个用户最多只能添加10个预警"
      };
    }
    let res;
    if(params._id){
      let list = await ctx.model.Marketwarn.find({_id: params._id});
      params.market = list[0].market;
      //修改
      res = await ctx.model.Marketwarn.findByIdAndUpdate(params._id, params);
    }else{
      //新增
      res = await ctx.model.Marketwarn.create(params);
    }
    return {
        code: 0,
        data: res,
        message: "OK"
    };
  }

  async getMarketwarn(params) {
    const {ctx, service, app} = this;
    let res = await ctx.model.Marketwarn.find(params);

    return {
        code: 0,
        data: res,
        message: "OK"
    };
  }

  async getMarketwarnList(params) {
    const {ctx, service, app} = this;
    let res = await ctx.model.Marketwarn.find(params).sort({ create_time: -1 });

    return {
        code: 0,
        data: res,
        message: "OK"
    };
  }

  async delMarketwarn(params) {
    const {ctx, service, app} = this;
    let data = await ctx.model.Marketwarn.find(params);
    if(data.length < 1){
      return {
        code: -1,
        data: null,
        message: "not found"
      };
    }
    let res = await ctx.model.Marketwarn.findByIdAndRemove(params._id);
    return {
        code: 0,
        data: res,
        message: "OK"
    };
  }

  async getMarketwarnByday() {
    const {ctx, service, app} = this;
    let params = {};
    params.flag = '1';

    return await ctx.model.Marketwarn.find(params);
  }

}

module.exports = UpdateService; 