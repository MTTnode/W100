'use strict';

const moment = require("moment");
const Service = require('egg').Service;

class StatService extends Service {
    /**
     * 客户端上报的统计
     * @param {*} arg 
     */
    async buildStatData(arg) {
        const { ctx, service, app } = this;
        let day = moment().format("YYYY-MM-DD");
        switch (arg.event_type) {
            case "signup": //新增用户
                if (arg.source == "android") {
                    app.redis.sadd('androidNewUser_' + day, arg.uid);
                }
                else if (arg.source == "ios") {
                    app.redis.sadd('iosNewUser_' + day, arg.uid);
                }
                break;
            case "signin": //活跃用户
                if (arg.source == "android") {
                    app.redis.sadd('androidActiveUser_' + day, arg.uid);
                }
                else if (arg.source == "ios") {
                    app.redis.sadd('iosActiveUser_' + day, arg.uid);
                }
                break;
            case "recharge": //充值
                let params = {};
                params.uid = arg.uid;
                params.event_type = arg.event_type;
                params.coin_type = arg.event_info.coin_type;
                params.coin_amount = arg.event_info.coin_amount;
                params.source = arg.source;
                await ctx.model.WeexStat.create(params);
                break;
            case "withdrawals": //提现
                let data = {};
                data.uid = arg.uid;
                data.event_type = arg.event_type;
                data.coin_type = arg.event_info.coin_type;
                data.coin_amount = arg.event_info.coin_amount;
                data.source = arg.source;
                await ctx.model.WeexStat.create(data);
                break;
        }
    }
    /**
     * 日活统计
     * @param {*} arg 
     */
    buildDau(arg) {
        const { ctx, service, app } = this;
        let day = moment().format("YYYY-MM-DD");
        if (arg.source == "android") {
            app.redis.sadd('androidDAU_' + day, arg.uid);
            app.redis.sadd('androidDAIP_' + day, arg.ip);
        }
        else if (arg.source == "ios") {
            app.redis.sadd('iosDAU_' + day, arg.uid);
            app.redis.sadd('iosDAIP_' + day, arg.ip);
        }
    }
    handleTime(arg) {
        const { ctx, service, app } = this;
        let day = moment().format("YYYY-MM-DD");
        if (arg < 100) {
            app.redis.hincrby('LHT', "100_" + day, 1);
        } else if (arg < 500) {
            app.redis.hincrby('LHT', "500_" + day, 1);
        } else if (arg < 1000) {
            app.redis.hincrby('LHT', "1000_" + day, 1);
        } else {
            app.redis.hincrby('LHT', "1000+_" + day, 1);
        }
    }
}

module.exports = StatService; 