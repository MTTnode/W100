const moment = require("moment");

module.exports = () => {
  return async function httpDefend(ctx, next) {
    //code 1002 代表被屏蔽
    // begin add cc 临时放过
    // return await next();
    // end add cc 临时放过
    let resBody = { code: 1002, message: '' };
    let arr = [];
    if(ctx.headers['x-real-ip']){
      arr.push({
        'ip': ctx.headers['x-real-ip']
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
      const msg = await ctx.defend.httpHandle(ctx);
      if(msg){
        resBody.message = "你的账户或IP已被封，请联系系统管理员！";
        ctx.service.httpDefend.addHttp(ctx, 1002);
        return ctx.body = resBody;
      }
    }
    await next();
  };
};