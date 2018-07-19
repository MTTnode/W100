const moment = require("moment");

module.exports = () => {
  return async function httpDefend(ctx, next) {
    //code 1002 代表被屏蔽
    // begin add cc 临时放过
    // return await next();
    // end add cc 临时放过

    let resBody = { code: 1002, message: '' };
    let arr = [];
    if(ctx.headers['x-forwarded-for'].split(',')[0]){
      arr.push({
        'ip': ctx.headers['x-forwarded-for'].split(',')[0]
      });
    }
    if(ctx.headers.uid != -1){
      arr.push({
        'uid': ctx.headers.uid
      });
    }
    let urlStr  = ctx.url;
    if(urlStr.indexOf('?') > -1){
      urlStr = urlStr.substring(0, urlStr.indexOf('?'));
    }
    arr.push({
      'url': urlStr
    });
    const listRes = await ctx.model.WeexWl.find({'$or': arr});
    if(listRes.length < 1){
      //检查黑名单列表
      let arr = [];
      arr.push({
        'ip': _this.headers['x-forwarded-for'].split(',')[0]
      });
      if(_this.headers.uid != '-1'){
        arr.push({
          'uid': _this.headers.uid
        });
      }
      const blacklistRes = await _this.model.WeexBl.find({'$or': arr});
      if(blacklistRes.length > 0){
        msg = blacklistRes[0].content;
        ctx.body = msg;
        return await next();
      }

      const msg = await ctx.defend.httpHandle(ctx);
      if(msg){
        resBody.message = "您的账户或IP已被封，请联系客服！";
        ctx.service.httpDefend.addHttp(ctx, 1002);
        return ctx.body = resBody;
      }
    }
    await next();
  };
};