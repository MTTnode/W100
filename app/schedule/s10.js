module.exports = {
  schedule: {
    interval: '10s',
    type: 'all',
  },
  async task(ctx) {
    ctx.app.weexHttps.setRate(ctx);
  }

};