const moment = require("moment");

module.exports = () => {
  return async function httpDefend(ctx, next) {
    //code 1002 代表被屏蔽
    // begin add cc 临时放过
    // return await next();
    // end add cc 临时放过

    //token检查 tim 20180628 修改 middleware
    if(!ctx.headers.token || (ctx.headers.token.length != 32 && ctx.headers.token != 'token')) {
      let paramItem = {
        'ip': '',
        'type': 0,
        'uid': '',
        'start_time': moment().format("YYYY-MM-DD HH:mm:ss"),
        'end_time': moment().add(1, 'days').format("YYYY-MM-DD HH:mm:ss"),
        'content': ''
      };
      paramItem.ip = ctx.headers['x-forwarded-for'].split(',')[0];
      paramItem.ip = ctx.ip;
      if(ctx.headers.uid != '-1'){
        paramItem.uid = ctx.headers.uid;
      }
      paramItem.content = "token异常";
      if(paramItem.ip || paramItem.uid){
        await ctx.model.WeexBl.create(paramItem);
      }
      return ctx.body = { code: 1002, message: '你的账户或IP已被封，请联系系统管理员！' };
    }

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