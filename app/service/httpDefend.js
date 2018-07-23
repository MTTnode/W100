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
    param.ip = el.headers['x-forwarded-for'].split(',')[0];
    param.token = el.headers.token;
    let time = moment().format("YYYY-MM-DD HH:mm:ss");
    param.create_time = time;
    let arr = [];
    arr.push({
      'ip': el.headers['x-forwarded-for'].split(',')[0]
    });
    if(el.headers.uid != -1){
      arr.push({
        'uid': el.headers.uid
      });
    }
    let json = await ctx.model.WeexBl.find({'$or': arr});
    if(json.length < 1){
      //记录http异常不处理
      await ctx.model.WeexHttp.create(param);
    }
  }

  async updateHttp(el, code) {
    const {ctx, service, app} = this;

    let param = {};
    param.method = el.method;
    param.url = el.url;
    param.uid = el.headers.uid;
    param.ip = el.headers['x-forwarded-for'].split(',')[0];
    param.token = el.headers.token;
    
    let json = await ctx.model.WeexHttp.find(param).sort({ create_time: -1 });
    if(json.length > 0){
      //记录http异常不处理
      await ctx.model.WeexHttp.update({ _id: json[0]._id}, {
        $set: {
          code: code
        }
      });
    }
  }

}

module.exports = HttpDefendService;
