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
    let res = '';
    if(transact.length > 0){
      res = await ctx.model.Transact.findOneAndUpdate({ "base" : params.base }, {$set: {"markets": params.markets}});
    }else{
      res = await ctx.model.Transact.create(params);
    }
    return {code: 0, data: res, massage: "OK"};
  }

  async find(id) {
    return this.ctx.model.Banner.findById(id)
  }

  //获取黑名单列表
  async getBlacklist(curPage) {
    const {ctx, service, app} = this;
    let blacklist1 = await ctx.model.WeexBl.find({});
    let blacklist2 = await ctx.model.WeexBl.find({}).limit(10).skip(curPage*10);
    let blacklists = {};
    blacklists.list = blacklist2;
    blacklists.total = blacklist1.length;

    return {code: 0, data: blacklists, massage: "OK"};
  }

  //新增黑名单
  async addBlack(params) {
    const {ctx, service, app} = this;
    let arr = [];
    if(params.ip){
      arr.push({
        'ip': params.ip
      });
    }
    if(params.uid != -1){
      arr.push({
        'uid': params.uid
      });
    }
    const blacklistRes = await ctx.model.WeexBl.find({'$or': arr});
    if(blacklistRes.length > 0){
      return {code: -1, data: '此账户或IP已被列入黑名单！', massage: ''};
    }
    params.start_time = moment().format("YYYY-MM-DD HH:mm:ss");
    params.end_time = moment().add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
    const res = await ctx.model.WeexBl.create(params);

    return {code: 0, data: res, massage: "OK"};
  }

  //删除黑名单
  async delBlack(_id) {
    const {ctx, service, app} = this;
    //delete
    const black = await ctx.model.WeexBl.findById(_id);
    if(!black){
      return {code: -1, data: '', massage: "not found"};
    }
    const res = await ctx.model.WeexBl.findByIdAndRemove(_id);

    return {code: 0, data: res, massage: "OK"};
  }

  //获取白名单列表
  async getWhitelist(curPage) {
    const {ctx, service, app} = this;
    let blacklist1 = await ctx.model.WeexWl.find({});
    let blacklist2 = await ctx.model.WeexWl.find({}).limit(10).skip(curPage*10);
    let blacklists = {};
    blacklists.list = blacklist2;
    blacklists.total = blacklist1.length;

    return {code: 0, data: blacklists, massage: "OK"};
  }

  //新增白名单
  async addWhite(params) {
    const {ctx, service, app} = this;
    let arr = [];
    if(params.ip){
      arr.push({
        'ip': params.ip
      });
    }
    if(params.uid != -1){
      arr.push({
        'uid': params.uid
      });
    }
    const blacklistRes = await ctx.model.WeexWl.find({'$or': arr});
    if(blacklistRes.length > 0){
      return {code: -1, data: '此账户或IP已被列入白名单！', massage: ''};
    }
    const res = await ctx.model.WeexWl.create(params);

    return {code: 0, data: res, massage: "OK"};
  }

  //删除白名单
  async delWhite(_id) {
    const {ctx, service, app} = this;
    //delete
    const black = await ctx.model.WeexWl.findById(_id);
    if(!black){
      return {code: -1, data: '', massage: "not found"};
    }
    const res = await ctx.model.WeexWl.findByIdAndRemove(_id);

    return {code: 0, data: res, massage: "OK"};
  }
}

module.exports = AdminConfigService;
