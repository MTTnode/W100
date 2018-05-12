// app.js
module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    ctx.logger.info("init server begin");
    ctx.app.weexWs.init(ctx.helper.getMarkets(), function () {
      
      ctx.app.weexWs.buildTodaySubscribe();
      ctx.logger.info("init server end");
    });
  });
};




