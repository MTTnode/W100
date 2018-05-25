module.exports = {
    schedule: {
        interval: '20s',
        type: 'all',
    }, async task(ctx) {
        let res = {};
        res.transactList = await ctx.service.banner.transactList();
        res.banner = await ctx.service.banner.bannerList();
        ctx.app.cache = res;
        
        ctx.bian.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            console.log(ctx.bian.get24hr());
            console.log("init bian end");
        });

        ctx.huobi.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            console.log(ctx.huobi.get24hr());
            console.log("init huobi end");
        });

        ctx.okex.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            console.log(ctx.okex.get24hr());
            console.log("init okex end");
        });

        ctx.ZB.reset24hr(ctx.helper.getMarkets()["USD"], function () {
            console.log(ctx.ZB.get24hr());
            console.log("init ZB end");
        });

    },
};