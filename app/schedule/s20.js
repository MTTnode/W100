module.exports = {
  schedule: {
    interval: '20s',
    type: 'all',
  },
  async task(ctx) {
    console.log(1111)
    let res = {};
    res.transactList = await ctx.service.banner.transactList();
    res.banner = await ctx.service.banner.bannerList();
    console.log(res)
    ctx.app.cache = res;
    console.log(ctx.app.cache)
  },
};