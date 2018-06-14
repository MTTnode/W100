const moment = require("moment");
const JPush = require("jpush-async").JPush;
// const client = JPush.buildClient('77bb191f81fb0b5cefffd2e0', '96401b931403dd89f4932627');  //test
const client = JPush.buildClient('91777cced183caccae6c1db5', 'faf37fc9aae6c9e168748a63');   //prod

module.exports = {
  schedule: {
    interval: '10s',
    type: 'worker',
  },
  async task(ctx) {
    if (await ctx.app.redis.setnx("LOOP_MESSAGE_DB", "1") == 1) {
      ctx.logger.info("loopDBMessage");
      // await ctx.app.tg.loopDBMessage(ctx.model.MessageLogs);
      try {
        let day = moment().format("YYYY-MM-DD");
        let res = await ctx.service.marketwarn.getMarketwarnByday();
        for (let v of res) {
          let str = v.market.replace('/', '');
          let type = v.market.substring(v.market.indexOf('/') + 1);
          let market = ctx.app.weexWs.getTodaySubscribe()[type][str];
          if (market) {
            //达到预警值
            ctx.app.redis.get('JPush_upprice_' + day + str + v.uid).then(val => {
              if (!val) {
                if (v.upprice && (market.last > parseFloat(v.upprice))) {
                  ctx.app.redis.set('JPush_upprice_' + day + str + v.uid, v.uid, 'EX', 86400);
                  client.push()
                    .setPlatform('ios', 'android')
                    .setAudience(JPush.alias(v.uid))
                    .setNotification('Hi, JPush', JPush.android('【' + v.market + '】价格已经到达预警值【' + v.upprice + '】，请注意风险控制', null, 1), JPush.ios('weex行情预警：【' + v.market + '】价格已经到达预警值【' + v.upprice + '】，请注意风险控制', 'sound', 1)).setMessage('msg content').setOptions(null, 60)
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
              }
            });
            ctx.app.redis.get('JPush_downprice_' + day + str + v.uid).then(val => {
              if (!val) {
                if (v.downprice && (market.last < parseFloat(v.downprice))) {
                  ctx.app.redis.set('JPush_downprice_' + day + str + v.uid, v.uid, 'EX', 86400);
                  client.push()
                    .setPlatform('ios', 'android')
                    .setAudience(JPush.alias(v.uid))
                    .setNotification('Hi, JPush', JPush.android('【' + v.market + '】价格已经到达预警值【' + v.downprice + '】，请注意风险控制', null, 1), JPush.ios('weex行情预警：【' + v.market + '】价格已经到达预警值【' + v.downprice + '】，请注意风险控制')).setMessage('msg content').setOptions(null, 60)
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
              }
            });
          }
        }
      } catch (error) {
        console.log(error)
      }
      await ctx.app.redis.del("LOOP_MESSAGE_DB");

    }
  }

};