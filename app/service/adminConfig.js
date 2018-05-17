'use strict';
const Service = require('egg').Service;

class AdminConfigService extends Service {
  async getBanner() {
    const {ctx, service, app} = this;
    let banner = await ctx.model.Banner.find({});
    let banners = {};
    banners.list = banner;
    banners.total = banner.length;

    return {code: 0, data: banners, massage: "OK"};
  }

  async saveBanner(params) {
    const {ctx, service, app} = this;
    let res = '';
    if(params._id){
      //更新
      const banner = await ctx.service.adminConfig.find(params._id);
      if(!banner){
        ctx.throw(404, 'banner not found')
      }
      res = await ctx.model.Banner.findByIdAndUpdate(params._id, params);
    }else{
      res = await ctx.model.Banner.create(params);
    }

    return {code: 0, data: res, massage: "OK"};
  }

  async delBanner(_id) {
    const {ctx, service, app} = this;
    //delete
    const banner = await ctx.service.adminConfig.find(_id);
    if(!banner){
      return {code: -1, data: '', massage: "banner not found"};
    }
    const res = await ctx.model.Banner.findByIdAndRemove(_id);

    return {code: 0, data: res, massage: "OK"};
  }

  async getTransactr() {
    const {ctx, service, app} = this;
    let transact = await ctx.model.Transact.find({});
    let transacts = {};
    transacts.list = transact;
    transacts.total = transact.length;

    return {code: 0, data: transacts, massage: "OK"};
  }

  async saveTransact(params) {
    const {ctx, service, app} = this;
    const transact = await ctx.model.Transact.find({ "base" : params.base });
    if(!transact){
      ctx.throw(404, 'transact not found')
    }
    let res = await ctx.model.Transact.findOneAndUpdate({ "base" : params.base }, {$set: {"markets": params.markets}});

    return {code: 0, data: res, massage: "OK"};
  }

  async find(id) {
    return this.ctx.model.Banner.findById(id)
  }

  // async getBlacklist(curPage) {
  //   const {ctx, service, app} = this;
  //   let blacklist = await ctx.model.WeexBl.find({}).limit(10).skip(curPage*10);
  //   let blacklists = {};
  //   blacklists.list = blacklist;
  //   blacklists.total = blacklist.length;

  //   return {code: 0, data: blacklists, massage: "OK"};
  // }
}

module.exports = AdminConfigService;
