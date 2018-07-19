'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

const DORA_PAY = "dora";
const USDT_PAY = "usdt";
const DADDY_PAY = "daddy";

const strKey_Recharge = "weex:payment:switch:recharge";
const strKey_Withdraw = "weex:payment:switch:withdraw";


class ManagerController extends Controller {

    /**
     * 查询可以使用的充值平台列表
     */
    async getSwitchInfo() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("getSwitchInfo", {
            //header
            ver: {
                type: 'string'
            },
            source: {
                type: 'string'
            },
            uid: {
                type: 'string'
            },
            token: {
                type: 'string'
            },
        });


        //开关
        let retSwitch = {
            //充值
            "recharge": {
                //支付宝
                "zhifubao": "1",
                //USDT
                "usdt": "1",
                //银行卡
                "bank": "1",
            },
            //提现
            "withdraw": {
                //支付宝
                "zhifubao": "0",
                //USDT
                "usdt": "1",
                //银行卡
                "bank": "1",
            }
        };

        let redis = this.ctx.app.redis;




        // //test
        // let ret = await redis.hset(strKey_Recharge, DORA_PAY, "0");
        // ret = await redis.hset(strKey_Recharge, USDT_PAY, "1");
        // ret = await redis.hset(strKey_Recharge, DADDY_PAY, "1");

        //充值
        let arrRecharge = await redis.hgetall(strKey_Recharge);

        Object.keys(arrRecharge).forEach(key => {
            console.log(key, arrRecharge[key]);
            if ("0" == arrRecharge[key]) {
                if (DORA_PAY == key) {
                    //关闭支付宝
                    retSwitch.recharge.zhifubao = "0";
                } else if (USDT_PAY == key) {
                    //关闭usdt
                    retSwitch.recharge.usdt = "0";
                } else if (DADDY_PAY == key) {
                    //关闭银行卡
                    retSwitch.recharge.bank = "0";
                }
            }
        });

        //提现
        let arrWithdraw = await redis.hgetall(strKey_Withdraw);
        Object.keys(arrWithdraw).forEach(key => {
            console.log(key, arrWithdraw[key]);
            if ("0" == arrWithdraw[key]) {
                if (DORA_PAY == key) {
                    //关闭支付宝
                    retSwitch.withdraw.zhifubao = "0";
                } else if (USDT_PAY == key) {
                    //关闭usdt
                    retSwitch.withdraw.usdt = "0";
                } else if (DADDY_PAY == key) {
                    //关闭银行卡
                    retSwitch.withdraw.bank = "0";
                }
            }
        });

        ctx.body = {
            code: 1000,
            data: retSwitch,
            message: "OK",
        };

        ctx.helper.end("getSwitchInfo");
    }


    //获取开关
    async getSwitch() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("getSwitch", {
        });

        let redis = this.ctx.app.redis;

        let objRecharge = await redis.hgetall(strKey_Recharge);
        let objWithdraw = await redis.hgetall(strKey_Withdraw);

        
        let listRecharge = [];
        Object.keys(objRecharge).forEach(key => {
            console.log(key, objRecharge[key]);
            let item = {};
            item.name = key;
            item.value = objRecharge[key];
            listRecharge.push(item);
        });

        let listWithdraw = [];
        Object.keys(objWithdraw).forEach(key => {
            console.log(key, objWithdraw[key]);
            let item = {};
            item.name = key;
            item.value = objWithdraw[key];
            listWithdraw.push(item);
        });

        let objRet = {
            "recharge": listRecharge,
            "withdraw": listWithdraw,
        }



        ctx.body = {
            code: 1000,
            message: 'OK',
            data: objRet
        };

        ctx.helper.end("getSwitch");
    }

    //设置开关
    async setSwitch() {
        const {
            ctx,
            service,
            app
        } = this;
        ctx.helper.pre("setSwitch", {
            key: {
                type: 'string'
            },
            value: {
                type: 'string'
            },
            type: {
                type: 'string'
            }
        });

        let redis = this.ctx.app.redis;

        let key = ctx.arg.key;
        let value = ctx.arg.value;
        let type = ctx.arg.type;

        //加判断只允许0 1两种状态
        if(value != "1"){
            value = "0";
        }

        let keyRedis = "";
        if ("recharge" == type) {
            keyRedis = strKey_Recharge;
        } else if ("withdraw" == type) {
            keyRedis = strKey_Withdraw;
        }

        if ("" == keyRedis) {
            ctx.body = {
                code: 1001,
                message: 'error',
                data: {}
            };

            ctx.helper.end("setSwitch");
            return;
        }

        //修改值
        let ret = await redis.hset(keyRedis, key, value);

        
        let objRecharge = await redis.hgetall(strKey_Recharge);
        let objWithdraw = await redis.hgetall(strKey_Withdraw);

        
        let listRecharge = [];
        Object.keys(objRecharge).forEach(key => {
            console.log(key, objRecharge[key]);
            let item = {};
            item.name = key;
            item.value = objRecharge[key];
            listRecharge.push(item);
        });

        let listWithdraw = [];
        Object.keys(objWithdraw).forEach(key => {
            console.log(key, objWithdraw[key]);
            let item = {};
            item.name = key;
            item.value = objWithdraw[key];
            listWithdraw.push(item);
        });

        let objRet = {
            "recharge": listRecharge,
            "withdraw": listWithdraw,
        }




        ctx.body = {
            code: 1000,
            message: 'OK',
            data: objRet
        };

        ctx.helper.end("setSwitch");
    }
}

module.exports = ManagerController;