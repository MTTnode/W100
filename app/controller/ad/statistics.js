'use strict';

const moment = require("moment");
const Controller = require('egg').Controller;
const _ = require("lodash");

class StatisticsController extends Controller {
    async index() {
        const { ctx, service, app } = this;
        
        let day = moment().format("YYYY-MM-DD");
        //new user
        let androidNewUser = await app.redis.smembers("androidNewUser_" + day);
        let iosNewUser = await app.redis.smembers("iosNewUser_" + day);

        //DAU
        let androidDAU = await app.redis.smembers("androidDAU_" + day);
        let iosDAU = await app.redis.smembers("iosDAU_" + day);

        //DAIP
        let androidDAIP = await app.redis.smembers("androidDAIP_" + day);
        let iosDAIP = await app.redis.smembers("iosDAIP_" + day);

        //LHT
        let LHT_100 = await app.redis.hget('LHT', "100_" + day);
        LHT_100 = LHT_100 ? LHT_100 : 0;
        let LHT_500 = await app.redis.hget('LHT', "500_" + day);
        LHT_500 = LHT_500 ? LHT_500 : 0;
        let LHT_1000 = await app.redis.hget('LHT', "1000_" + day);
        LHT_1000 = LHT_1000 ? LHT_1000 : 0;
        let LHT_1001 = await app.redis.hget('LHT', "1000+_" + day);
        LHT_1001 = LHT_1001 ? LHT_1001 : 0;
        let LHT = parseInt(LHT_100) + parseInt(LHT_500) + parseInt(LHT_1000) + parseInt(LHT_1001);

        ctx.body = {
            code: 0,
            data: {
              androidNewUser: androidNewUser ? androidNewUser.length : 0,
              iosNewUser: iosNewUser ? iosNewUser.length : 0,
              androidDAU: androidDAU ? androidDAU.length : 0,
              iosDAU: iosDAU ? iosDAU.length : 0,
              androidDAIP: androidDAIP ? androidDAIP.length : 0,
              iosDAIP: iosDAIP ? iosDAIP.length : 0,
              LHT_100: LHT_100, 
              LHT_500: LHT_500,
              LHT_1000: LHT_1000,
              LHT_1001: LHT_1001
            },
            message: "OK",
        };
    }
}

module.exports = StatisticsController;
