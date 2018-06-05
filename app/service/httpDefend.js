'use strict';

const moment = require("moment");
const Service = require('egg').Service;

class HttpDefendService extends Service {

  async addHttp(el, code) {
    const {ctx, service, app} = this;
    let param = {};
    param.method = el.method;
    param.url = el.url;
    param.params = JSON.stringify(el.request.body);
    param.code = code;
    param.uid = el.headers.uid;
    param.ip = el.headers['x-real-ip'];
    param.token = el.headers.token;
    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    param.create_time = time;

    //记录http异常不处理
    await ctx.model.WeexHttp.create(param);

  }

}

module.exports = HttpDefendService;
