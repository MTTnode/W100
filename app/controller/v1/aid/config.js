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

        ctx.body = await service.banner.bannerList();
        ctx.helper.end("banner");
    }
}

module.exports = ConfigController;
