module.exports = {
  schedule: {
    interval: '20s',
    type: 'all',
  },
  async task(ctx) {
    let res = {};
    res.transactList = await ctx.service.banner.transactList();
    res.banner = await ctx.service.banner.bannerList();
    ctx.app.cache = res;
  },
};