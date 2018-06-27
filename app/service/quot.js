'use strict';
const Service = require('egg').Service;

class QuotService extends Service {
  async addQuot() {
    const {ctx, service, app} = this;
    let data = await ctx.model.Quto.find({uid: ctx.arg.uid, market: ctx.arg.market});
    let res = '';
    if(data.length > 0){
      return res = {
        code: -1,
        data: null,
        massage: "你已经选了这个交易对"
      };
    }else{
      let param = {};
      param.uid = ctx.arg.uid;
      param.market = ctx.arg.market;
      let json = await ctx.model.Quto.create(param);
      return res = {
        code: 0,
        data: json,
        massage: "OK"
      };
    }
  }

  async delQuot() {
    const {ctx, service, app} = this;
    let data = await ctx.model.Quto.find({uid: ctx.arg.uid, market: ctx.arg.market});
    let res = '';
    if(data.length == 0){
      return res = {
        code: -1,
        data: null,
        massage: "先添加自选"
      };
    }else{
      let item = await ctx.model.Quto.remove({uid: ctx.arg.uid, market: ctx.arg.market});
      return res = {
        code: 0,
        data: item,
        massage: "OK"
      };
    }
  }

  async isQuot() {
    const {ctx, service, app} = this;
    let data = await ctx.model.Quto.find({uid: ctx.arg.uid, market: ctx.arg.market});
    let res = '';
    if(data.length == 0){
      return res = {
        code: -1,
        data: null,
        massage: "交易对不在自选区"
      };
    }else{
      return res = {
        code: 0,
        data: data,
        massage: "OK"
      };
    }
  }

  async quotInfo() {
    const {ctx, service, app} = this;

    let data = await ctx.model.Quto.find({uid: ctx.arg.uid});
    let res = '';
    let list = [];
    data.forEach(ele => {
      list.push(ele.market);
    });
    return res = {
      code: 0,
      data: list,
      massage: "OK"
    };
  }

}

module.exports = QuotService;
