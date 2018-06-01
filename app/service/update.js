'use strict';
const Service = require('egg').Service;

class UpdateService extends Service {

  async checkList() {
    const {ctx, service, app} = this;
    let res = await ctx.model.WeexVersion.find({}).sort({ create_time: -1 });
    return {
        code: 0,
        data: res,
        massage: "OK"
    };
  }
  
  async addVaersion(params) {
    const {ctx, service, app} = this;
    let res = await ctx.model.WeexVersion.create(params);

    return {
        code: 0,
        data: res,
        massage: "OK"
    };
  }

}

module.exports = UpdateService; 