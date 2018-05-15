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
      // url: "https://wwwapp.weex.com:8443/"
      url: "https://www.bithe.com/"
    }
  };

  config.weexWs = {
    client: {
      // url: "wss://wsapp.weex.com:8443"
      url: "wss://ws.bithe.com"
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

  return config;
};


