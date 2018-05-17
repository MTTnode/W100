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
  //检查黑名单列表
  const blacklistRes = await _this.model.WeexBl.find({'$or': [{'ip': _this.headers['x-real-ip']}, {'uid': _this.headers.uid}]});
  if(blacklistRes.length > 0){
    msg = blacklistRes[0].content;
  }
  //token检查
  if(!_this.headers.token || (_this.headers.token.length != 32 && _this.headers.token != 'token')) {
    paramItem.ip = _this.headers['x-real-ip'];
    if(_this.headers.uid != -1){
      paramItem.uid = _this.headers.uid;
    }
    paramItem.content = "token异常";
    await _this.model.WeexBl.create(paramItem);
    msg = paramItem.content;
  }

  //404检查 （ 1min 10 )
  //ip
  const statusResip = await _this.model.WeexHttp.find({
    'ip': _this.headers['x-real-ip'],
    'code': 404,
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
  });
  if(statusResip.length > 10){
    paramItem.ip = _this.headers['x-real-ip'];
    if(_this.headers.uid != -1){
      paramItem.uid = _this.headers.uid;
    }
    paramItem.content = "单个ip多次访问不存在的url";
    await _this.model.WeexBl.create(paramItem);
    msg = paramItem.content;
  }
  //uid
  if(_this.headers.uid != -1){
    const statusResid = await _this.model.WeexHttp.find({
      'uid': _this.headers.uid,
      'code': 404,
      'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
    });
    if(statusResid.length > 10){
      paramItem.uid = _this.headers.uid;
      paramItem.content = "单个用户多次访问不存在的url";
      await _this.model.WeexBl.create(paramItem);
      msg = paramItem.content;
    }
  }
  //检查参数  (同一个接口   1min -> 10)
  const paramsRes = await _this.model.WeexHttp.find({
    'url': _this.url,
    'code': 1001,
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
  }, {
    '$or': [{
      'uid': _this.headers.uid == -1 ? '' : _this.headers.uid,
      'ip': _this.headers['x-real-ip']
    }]
  });
  if(paramsRes.length > 10) {
    paramItem.ip = _this.headers['x-real-ip'];
    paramItem.uid = _this.headers.uid == -1 ? '' : _this.headers.uid;
    paramItem.content = "单个接口多次访问不同的参数";
    await _this.model.WeexBl.create(paramItem);
    msg = paramItem.content;
  }

  //检查ip,uid对应关系（ 2min 1 -> 10 )
  //uid
  if(_this.headers.uid != -1){
    const IpIdRes = await _this.model.WeexHttp.find({
      'uid': _this.headers.uid,
      'create_time': {'$gte': moment().subtract(2, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
    });
    if(IpIdRes.length > 10){
      paramItem.uid = _this.headers.uid;
      paramItem.content = "同个UID对应多个IP";
      await _this.model.WeexBl.create(paramItem);
      msg = paramItem.content;
    }
  }
  //ip
  const IdIpRes = await _this.model.WeexHttp.find({
    'ip': _this.headers['x-real-ip'],
    'create_time': {'$gte': moment().subtract(2, 'minutes').format("YYYY-MM-DD HH:mm:ss")}
  });
  if(IdIpRes.length > 10){
    paramItem.ip = _this.headers['x-real-ip'];
    paramItem.content = "同个IP对应多个UID";
    await _this.model.WeexBl.create(paramItem);
    msg = paramItem.content;
  }
  //检查接口访问频率 （ 单个接口 1min 10）
  const UrlIpRes = await _this.model.WeexHttp.find({
    'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")},
    'url': _this.url,
    'ip': _this.headers['x-real-ip']
  });
  if(UrlIpRes.length > 10){
    paramItem.ip = _this.headers['x-real-ip'];
    paramItem.content = "同一个接口单个IP访问频率过高";
    await _this.model.WeexBl.create(paramItem);
    msg = paramItem.content;
  }
  if(_this.headers.uid != -1){
    const UrlUidRes = await _this.model.WeexHttp.find({
      'create_time': {'$gte': moment().subtract(1, 'minutes').format("YYYY-MM-DD HH:mm:ss")},
      'url': _this.url,
      'uid': _this.headers.uid
    });
    if(UrlUidRes.length > 10){
      paramItem.uid = _this.headers.uid;
      paramItem.content = "同一个接口单个UID访问频率过高";
      await _this.model.WeexBl.create(paramItem);
      msg = paramItem.content;
    }
  }
  return msg;
}

module.exports = {
  defend: {
    httpHandle: httpHandle
  }
};