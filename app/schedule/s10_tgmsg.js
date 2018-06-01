const moment = require("moment");
const JPush = require("jpush-async").JPush;
const client = JPush.buildClient('77bb191f81fb0b5cefffd2e0', '96401b931403dd89f4932627');

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