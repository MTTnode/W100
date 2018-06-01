
module.exports = {
    schedule: {
        interval: '10s',
        type: 'worker',
    },
    async task(ctx) {
        if (await ctx.app.redis.setnx("LOOP_MESSAGE_DB", "1") == 1) {
            ctx.logger.info("loopDBMessage");
            await ctx.app.tg.loopDBMessage(ctx.model.MessageLogs);
            await ctx.app.redis.del("LOOP_MESSAGE_DB");
        }
    }

};