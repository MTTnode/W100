'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class ConfigController extends Controller {
    async banner() {
        const { ctx, service, app } = this;
        ctx.helper.pre("banner", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            screen: { type: 'string' },
        });
        let banners = await ctx.service.banner.bannerList();
        // if(ctx.app.cache){
        //   banners = ctx.app.cache.banner;
        // }else{
        //   banners = await ctx.service.banner.bannerList();
        // }
        ctx.body = banners;
        ctx.helper.end("banner");
    }


    async getCurrency() {
        const { ctx, service, app } = this;
        ctx.helper.pre("getCurrency", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
        });
        ctx.body = {
            code: 1000,
            data: ["BTC,BCH,LTC,ETH,ZEC,DASH,ETC,XRP,DOGE"]
        };
        ctx.helper.end("banner");
    }
}

module.exports = ConfigController;
