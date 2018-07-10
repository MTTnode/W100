'use strict';

// had enabled by egg
// exports.static = true;
const path = require('path');
exports.validate = {
    enable: true,
    package: 'egg-validate',
};

exports.bian = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-bian'),
};

exports.huobi = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-huobi'),
};

exports.okex = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-okex'),
};

exports.ZB = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-ZB'),
};

exports.bithumb = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-bithumb'),
};

exports.bitstamp = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-bitstamp'),
};

exports.gateio = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-gateio'),
};

exports.bcex = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-bcex'),
};

exports.kraken = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-kraken'),
};

//defend
exports.defend = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-defend'),
};

//redis config
exports.redis = {
    enable: true,
    package: 'egg-redis'
};

exports.weexWs = {
  enable: true,
  package: 'egg-weex-ws',
};

exports.weexHttps = {
    enable: true,
    package: 'egg-weex-https',
    // path: path.join(__dirname, '../lib/plugin/egg-weex-https'),
};

exports.weexToken = {
  enable: true,
  package: 'egg-weex-token',
  // path: path.join(__dirname, '../lib/plugin/egg-weex-token'),
};

//egg-logrotator
exports.logrotator = {
  enable: true,
  package: 'egg-logrotator'
};

//egg-mongoose
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.w100Payment = {
    enable: true,
    package: 'egg-w100-payment',
};

//tg
exports.tg = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-tg'),
};
