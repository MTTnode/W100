const moment = require("moment");
const JPush = require("jpush-async").JPush;
const client = JPush.buildClient('77bb191f81fb0b5cefffd2e0', '96401b931403dd89f4932627');

module.exports = {
  schedule: {
    interval: '10s',
    type: 'all',
  },
  async task(ctx) {
    ctx.app.weexHttps.setRate(ctx);

    if (await ctx.app.redis.setnx("LOOP_MESSAGE_DB", "1") == 1) {
      ctx.logger.info("loopDBMessage");
      console.log();
      await ctx.app.tg.loopDBMessage(ctx.model.MessageLogs);
      await ctx.app.redis.del("LOOP_MESSAGE_DB");
    }

    let day = moment().format("YYYY-MM-DD");
    let res = await ctx.service.marketwarn.getMarketwarnByday();
    for (let v of res) {
      let str = v.market.replace('/', '');
      let type = v.market.substring(v.market.indexOf('/') + 1);
      let market = ctx.app.weexWs.getTodaySubscribe()[type][str];
      if (market) {
        //达到预警值
        ctx.app.redis.get('JPush_' + day + str + v.uid).then(val => {
          if (!val) {
            if (v.upprice && (market.last > v.upprice)) {
              client.push()
                .setPlatform('ios', 'android')
                .setAudience(JPush.alias(v.uid))
                .setNotification('Hi, JPush', JPush.android('weex行情预警：【' + v.market + '】价格已经到达预警值【' + v.upprice + '】，请注意风险控制', null, 1), JPush.ios('weex行情预警：【' + v.market + '】价格已经到达预警值【' + v.upprice + '】，请注意风险控制', 'sound', 1)).setMessage('msg content').setOptions(null, 60)
                .send(function (err, res) {
                  if (err) {
                    if (err instanceof JPush.APIConnectionError) {
                      console.log(err.message)
                    } else if (err instanceof JPush.APIRequestError) {
                      console.log(err.message)
                    }
                  } else {
                    ctx.app.getLogger('weexLogger').info(JSON.stringify(res));
                  }
                });
            }
            if ((v.downprice && (market.last < v.downprice))) {
              client.push()
                .setPlatform('ios', 'android')
                .setAudience(JPush.alias(v.uid))
                .setNotification('Hi, JPush', JPush.android('weex行情预警：【' + v.market + '】价格已经到达预警值【' + v.downprice + '】，请注意风险控制', null, 1), JPush.ios('weex行情预警：【' + v.market + '】价格已经到达预警值【' + v.downprice + '】，请注意风险控制')).setMessage('msg content').setOptions(null, 60)
                .send(function (err, res) {
                  if (err) {
                    if (err instanceof JPush.APIConnectionError) {
                      console.log(err.message)
                    } else if (err instanceof JPush.APIRequestError) {
                      console.log(err.message)
                    }
                  } else {
                    ctx.app.getLogger('weexLogger').info(JSON.stringify(res));
                  }
                });
            }
            ctx.app.redis.set('JPush_' + day + str + v.uid, v.uid, 'EX', 86400);
          }
        });
      }
    }
    ctx.app.weexHttps.setRate(ctx);
  }

};