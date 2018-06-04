const moment = require("moment");
const JPush = require("jpush-async").JPush;
const client = JPush.buildClient('77bb191f81fb0b5cefffd2e0', '96401b931403dd89f4932627');

module.exports = {
  schedule: {
    interval: '10s',
    type: 'all',
  },
  async task(ctx) {
    ctx.app.weexHttps.setRate(ctx);
  }

};