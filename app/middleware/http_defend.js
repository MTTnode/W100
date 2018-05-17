const moment = require("moment");

module.exports = () => {
  return async function httpDefend(ctx, next) {
    //code 1002 代表被屏蔽
    let resBody = { code: 1002, message: '' };

    const msg = await ctx.defend.httpHandle(ctx);
    if(msg){
      resBody.message = "你的账户或IP已被封，请联系系统管理员！";
      ctx.service.httpDefend.addHttp(ctx, 1002);
      return ctx.body = resBody;
    }
    console.log('育龙的IP:'+ctx.headers.x-real-ip)
    
    await next();
  };
};