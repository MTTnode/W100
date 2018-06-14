'use strict';
const Service = require('egg').Service;

class UserService extends Service {
    async getUserAsset(token) {
        const { ctx, service, app } = this;
        //获取用户资产
        var userAsset = await app.weexHttps.getUserAsset(this, token);
        if (userAsset.code != 0) {
            return userAsset;
        }
        //获取当天0点的值
        var kline0 = app.weexWs.getTodaySubscribe()["USD"];
        //获取当前汇率
        var rate = app.weexHttps.getRate();
        // console.log('==========资产统计============');
        var total = 0;
        var marketsKey = Object.keys(userAsset.data.markets);
        // console.log(userAsset);
        // console.log(kline0);
        try {
          for (var i = 0; i < marketsKey.length; i++) {
            total += kline0[marketsKey[i]].open * userAsset.data.markets[marketsKey[i]].v;
          }
        } catch (error) {
          console.log(error);
        }
        total += userAsset.data.USD;
        var ret = ctx.helper.getPriceChange(userAsset.data.total, total);
        ret.cny = "￥" + (userAsset.data.total * Number(rate.cash_buy_rate)).toFixed(2);
        ret.usd = "$" + (userAsset.data.total).toFixed(2);
        ret.cny_leverage = "￥" + (userAsset.data.leverage_total * Number(rate.cash_buy_rate)).toFixed(2);
        ret.usd_leverage = "$" + (userAsset.data.leverage_total).toFixed(2);
        ret.total_cny = "￥" + (userAsset.data.total * Number(rate.cash_buy_rate)+userAsset.data.leverage_total * Number(rate.cash_buy_rate)).toFixed(2);
        ret.total_usd = "$" + (userAsset.data.total + userAsset.data.leverage_total).toFixed(2);
        return {
            code: 0,
            data: ret,
            massage: "OK"
        };
    }
}

module.exports = UserService; 