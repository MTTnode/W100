'use strict';
const Service = require('egg').Service;

class BannerService extends Service {
  async bannerList() {
    const {ctx, service, app} = this;
    let banner = await ctx.model.Banner.find({});

    return {code: 0, data: banner, massage: "OK"};
  }
  
  async transactList() {
    const {ctx, service, app} = this;
    let transact = await ctx.model.Transact.find({});
    let res = {};
    transact.forEach(item => {
      let arr = item.markets.split(',')
      res[item.base] = arr;
    });
    return res;
  }

}

module.exports = BannerService;
