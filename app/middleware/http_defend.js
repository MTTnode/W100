const moment = require("moment");

module.exports = () => {
  return async function httpDefend(ctx, next) {
    //code 1002 代表被屏蔽
    let resBody = { code: 1002, message: '' };

    const msg = await ctx.defend.httpHandle(ctx);
    if(msg){
      resBody.message = msg;
      ctx.service.httpDefend.addHttp(ctx, 1002);
      return ctx.body = resBody;
    }
    
    await next();
  };
};