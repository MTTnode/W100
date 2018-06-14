module.exports = {
    schedule: {
        interval: '20s',
        type: 'worker',
    }, async task(ctx) {
        let res = {};
        res.transactList = await ctx.service.banner.transactList();
        res.banner = await ctx.service.banner.bannerList();
        ctx.app.cache = res;
        // return;
        //暂时不可用
        // ctx.bithumb.reset24hr(ctx.helper.getMarkets()["USD"], function () {
        //   // console.log(ctx.bithumb.get24hr());
        //   console.log("init bithumb end");
        // });

        //可用
        ctx.bitstamp.reset24hr(ctx.helper.getMarkets()["USD"], function () {
          // console.log(ctx.bitstamp.get24hr());
          console.log("init bitstamp end");
        });

        //可用
        ctx.gateio.reset24hr(ctx.helper.getMarkets()["USD"], function () {
          // console.log(ctx.gateio.get24hr());
          console.log("init gateio end");
        });

        //可用
        ctx.bcex.reset24hr(ctx.helper.getMarkets()["USD"], function () {
          // console.log(ctx.bcex.get24hr());
          console.log("init bcex end");
        });

        //可用
        ctx.kraken.reset24hr(ctx.helper.getMarkets()["USD"], function () {
          // console.log(ctx.kraken.get24hr());
          console.log("init kraken end");
        });

        ctx.bian.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            // console.log(ctx.bian.get24hr());
            console.log("init bian end");
        });

        ctx.huobi.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            // console.log(ctx.huobi.get24hr());
            console.log("init huobi end");
        });

        ctx.okex.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            // console.log(ctx.okex.get24hr());
            console.log("init okex end");
        });

        ctx.ZB.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            // console.log(ctx.ZB.get24hr());
            console.log("init ZB end");
        });

    },
};