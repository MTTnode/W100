'use strict';
const moment = require("moment");

const httpHandle = async function(_this){
  let msg;
  let paramItem = {
    'ip': '',
    'type': 0,
    'uid': '',
    'start_time': moment().format("YYYY-MM-DD HH:mm:ss"),
    'end_time': moment().add(1, 'days').format("YYYY-MM-DD HH:mm:ss"),
    'content': ''
  };

  let arr = [];
  arr.push({
    'ip': el.headers['x-forwarded-for'].split(',')[0]
  });
  if(el.headers.uid != -1){
    arr.push({
      'uid': el.headers.uid
    });
  }
  let arrRes = await ctx.model.WeexBl.find({'$or': arr});
  if(arrRes.length > 0){
    msg = "您的账户或IP已被封，请联系客服！";
    return msg;
  }
  //token检查
  if(!_this.headers.token || (_this.headers.token.length != 32 && _this.headers.token != 'token')) {
    paramItem.ip = _this.headers['x-forwarded-for'].split(',')[0];
    if(_this.headers.uid != -1){
      paramItem.uid = _this.headers.uid;
    }
    paramItem.content = "token异常";
    if(paramItem.ip || paramItem.uid){
      await _this.model.WeexBl.create(paramItem);
    }
    msg = paramItem.content;
    return msg;
  }

  //404检查 （ 1min 30 )
  //ip
  const statusResip = await _this.model.WeexHttp.find({
    'ip': _this.headers['x-forwarded-for'].split(',')[0],
    'code': 404,
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
  });
  if(statusResip.length > 30){
    paramItem.ip = _this.headers['x-forwarded-for'].split(',')[0];
    if(_this.headers.uid != '-1'){
      paramItem.uid = _this.headers.uid;
    }
    paramItem.content = "单个ip多次访问不存在的url";
    if(paramItem.ip || paramItem.uid){
      await _this.model.WeexBl.create(paramItem);
    }
    msg = paramItem.content;
    return msg;
  }
  //uid
  if(_this.headers.uid != '-1'){
    const statusResid = await _this.model.WeexHttp.find({
      'uid': _this.headers.uid,
      'code': 404,
      'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
    });
    if(statusResid.length > 30){
      paramItem.uid = _this.headers.uid;
      paramItem.content = "单个用户多次访问不存在的url";
      if(paramItem.ip || paramItem.uid){
        await _this.model.WeexBl.create(paramItem);
      }
      msg = paramItem.content;
      return msg;
    }
  }
  //检查参数  (同一个接口   1min -> 30)
  const paramsRes = await _this.model.WeexHttp.find({
    'url': _this.url,
    'code': 1001,
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
  }, {
    '$or': [{
      'uid': _this.headers.uid == '-1' ? '' : _this.headers.uid,
      'ip': _this.headers['x-forwarded-for'].split(',')[0]
    }]
  });
  if(paramsRes.length > 30) {
    paramItem.ip = _this.headers['x-forwarded-for'].split(',')[0];
    paramItem.uid = _this.headers.uid == -1 ? '' : _this.headers.uid;
    paramItem.content = "单个接口多次访问不同的参数";
    if(paramItem.ip || paramItem.uid){
      await _this.model.WeexBl.create(paramItem);
    }
    msg = paramItem.content;
    return msg;
  }

  //检查ip,uid对应关系（ 1min 1 -> 30 )
  //uid
  if(_this.headers.uid != '-1'){
    const IpIdRes = await _this.model.WeexHttp.distinct("ip", {
      'uid': _this.headers.uid,
      'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
    });
    if(IpIdRes.length > 30){
      paramItem.uid = _this.headers.uid;
      paramItem.content = "同个UID对应多个IP";
      if(paramItem.ip || paramItem.uid){
        await _this.model.WeexBl.create(paramItem);
      }
      msg = paramItem.content;
      return msg;
    }
  }
  //ip
  const IdIpRes = await _this.model.WeexHttp.distinct("uid", {
    'ip': _this.headers['x-forwarded-for'].split(',')[0],
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
  });
  if(IdIpRes.length > 30){
    paramItem.ip = _this.headers['x-forwarded-for'].split(',')[0];
    paramItem.content = "同个IP对应多个UID";
    if(paramItem.ip || paramItem.uid){
      await _this.model.WeexBl.create(paramItem);
    }
    msg = paramItem.content;
    return msg;
  }
  //检查接口访问频率 （ 单个接口 1min 30）
  const UrlIpRes = await _this.model.WeexHttp.find({
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")},
    'url': _this.url,
    'ip': _this.headers['x-forwarded-for'].split(',')[0]
  });
  if(UrlIpRes.length > 30){
    paramItem.ip = _this.headers['x-forwarded-for'].split(',')[0];
    paramItem.content = "同一个接口单个IP访问频率过高";
    if(paramItem.ip || paramItem.uid){
      await _this.model.WeexBl.create(paramItem);
    }
    msg = paramItem.content;
    return msg;
  }
  if(_this.headers.uid != '-1'){
    const UrlUidRes = await _this.model.WeexHttp.find({
      'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")},
      'url': _this.url,
      'uid': _this.headers.uid
    });
    if(UrlUidRes.length > 30){
      paramItem.uid = _this.headers.uid;
      paramItem.content = "同一个接口单个UID访问频率过高";
      if(paramItem.ip || paramItem.uid){
        await _this.model.WeexBl.create(paramItem);
      }
      msg = paramItem.content;
      return msg;
    }
  }
}

module.exports = {
  defend: {
    httpHandle: httpHandle
  }
};
