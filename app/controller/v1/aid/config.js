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

        ctx.body = {
            code: 0,
            data: [
                { "type": 0, "imgurl": "http://222.73.56.202/w100/W100_img/a-750x380.png", deturl: "", id: "134e" },
                { "type": 0, "imgurl": "http://222.73.56.202/w100/W100_img/b-750x380.png", deturl: "", id: "34e2" },
                { "type": 0, "imgurl": "http://222.73.56.202/w100/W100_img/c-750x380.png", deturl: "", id: "we3" },
            ],
            message: "OK",
        };
        ctx.helper.end("banner");
    }
}

module.exports = ConfigController;
