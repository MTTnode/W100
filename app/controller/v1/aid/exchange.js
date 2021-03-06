'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class ExchangeController extends Controller {
  async quot() {
    const {
      ctx,
      service,
      app
    } = this;
    ctx.helper.pre("quot", {
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

    var data = [{
      exchage: "币安",
      data: ctx.bian.get24hr()
    }, {
      exchage: "火币",
      data: ctx.huobi.get24hr()
    }, {
      exchage: "OKEx",
      data: ctx.okex.get24hr()
    }, {
      exchage: "ZB",
      data: ctx.ZB.get24hr()
    }, ]

    ctx.body = {
      code: 0,
      data: data,
      message: "OK",
    };
    ctx.helper.end("quot");
  }

  async quots() {
    const {
      ctx,
      service,
      app
    } = this;
    ctx.helper.pre("quot", {
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

    //Tim 修改第三方行情数据格式
    let markets = await ctx.service.banner.transactList();
    let data = [];
    markets.USD.forEach(element => {
      let item = {};
      item.market = element;
      item.data = [];
      ctx.bian.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'Binance';
          item.data.push(res);
        }
      });
      ctx.huobi.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'Huobi';
          item.data.push(res);
        }
      });
      ctx.okex.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'OKEx';
          item.data.push(res);
        }
      });
      ctx.ZB.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'ZB';
          item.data.push(res);
        }
      });
      ctx.bitstamp.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'Bitstamp';
          item.data.push(res);
        }
      });
      ctx.gateio.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'Gate';
          item.data.push(res);
        }
      });
      ctx.bcex.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'BCEX';
          item.data.push(res);
        }
      });
      ctx.kraken.get24hr().forEach(res => {
        if (res.symbol == element) {
          res.exchage = 'Kraken';
          item.data.push(res);
        }
      });
      data.push(item);
    });

    ctx.body = {
      code: 0,
      data: data,
      message: "OK",
    };
    ctx.helper.end("quot");
  }
}

module.exports = ExchangeController;