module.exports = {
  schedule: {
    interval: '10s',
    type: 'worker',
  },
  async task(ctx) {
    // ctx.app.weexHttps.setRate(ctx);
  }

};