'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {

  };
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 加载 errorHandler 中间件
  config.middleware = ['httpDefend', 'errorHandler'];

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1524152383762_782';

  config.weexHttps = {
    client: {
      url: "https://wwwapp.weex.com:8443/"
      // url: "https://www.bithe.com/"
    }
  };

  config.weexWs = {
    client: {
      url: "wss://wsapp.weex.com:8443"
      // url: "wss://ws.bithe.com"
    }
  };

  //redis config
  config.redis = {
    client: {
      port: 6379,
      host: '140.143.230.232',
      password: 'xiaotao123',
      db: 0
    }
  }

  //weexLogger config
  config.customLogger = {
    weexLogger: {
      file: path.join(appInfo.root, 'logs/weexLogger.log'),
      outputJSON: true,
    }
  }

  //egg-logrotator
  config.logrotator = {
    filesRotateByHour: [
      path.join(appInfo.root, 'logs', appInfo.name, 'weexLogger.json.log'),
    ],                                // 需要按小时切割的文件
    hourDelimiter: '-',               // 按照小时切割的文件, 小时部分的分隔符.
  };

  //egg-mongoose
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/weexdb',
    options: {
    }
  };
  //tg配置
  config.tg = {
    client: {
      key: "468478553:AAECQWsTNj5wkzTHNcS1IIw48d_GqoFwox8", // 说明文档问CC
      rule: {
        "exception": [
          "cc"
        ],
        "usdt": [
          "cc"
        ]
      }
    }
  };
  //支付配置
  config.w100Payment = {
    client: {
      weex: {
        access_id: "1A491D533A704AF48F3DB8A57938EAE8",
        secret_key: "A7376A5E1D7F4149B23B53C946CB68D63CD47BA6699D596B",
        hostname: "wwwapp.weex.com",
        port: 8000,
        path: "/internal/exchange/account/pay/balance"
      }, coinsDo: {
        "aging": 1000 * 60 * 60 * 24,
        "callbackurl": "http://222.73.56.202:3000/w100/v1/payment/callback",
        "url": "http://uat.coinsdo.com/v1/morder/paycoin",
        "queryurl": "http://uat.coinsdo.com/v1/morder/query",
        "merch_id": "10000",
        "merch_key": "ZDcyZTBlMDBiYjYyMTlmOTA0ZDhlODUxOTgxOTk0ZDY5YjBkYWMzZQ=="
      }, dora: {
        "api_key":"86d69e833d14b8859cb81029b3bebaa7",
        "company_id":54,
        "callbackurl": "https://wwwapp.weex.com:8443/w100/v1/payment/dora_callback",
        "url": "https://countermobile.xi33.net/DoraCounterMobile/Deposit/Index",
        "charset":"UTF-8",
        "api_version": "1.5",
        amount:{
          "amount_min":20.00,
          "amount_max":5000.00,
          //提现
          "withdraw_min":20.00,
          "withdraw_max":5000.00,
        },
        fees: {
          "fees_pc": "1.9",
          "fees_mobile": "2.0",
          "fees_withdraw_fixed_costs": "5", //提现：固定费用
        },
        "url_withdraw": "https://countermobile.xi33.net/DoraCounterMobile/api/counter/WithdrawalApplyAsync",
        "callbackurl_withdraw": "https://wwwapp.weex.com:8443/w100/v1/payment/dora_callback",
      }, blc: {
       "keyConfig":"WX123456",
       "merchantID":377,
       "url_DepositApply": "https://blc.1oba.com/BLC_API/json/reply/DepositApply",
       "webUrl":"wwwapp.weex.com",
       amount:{
         "amount_min":20.00,
         "amount_max":500000.00,
       },
       fees: {
         "fees_pc": "0",
         "fees_mobile": "0",
       }
     }
    }
  };
9
  return config;
};


