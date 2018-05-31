module.exports = {
    schedule: {
        interval: '10s',
        type: 'all',
    },
    async task(ctx) {
      ctx.app.weexHttps.setRate(ctx);
      await ctx.app.tg.loopDBMessage(ctx.model.MessageLogs);
    }
};