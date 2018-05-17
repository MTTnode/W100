module.exports = {
  schedule: {
    interval: '60m',
    type: 'all',
  },
  async task(ctx) {
    ctx.app.cache = await ctx.service.banner.transactList();
  },
};