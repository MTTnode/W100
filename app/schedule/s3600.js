module.exports = {
    schedule: {
      interval: '3600m', 
      type: 'worker', 
    },
    async task(ctx) {
      console.log("kline loop begin");
      ctx.startKline();  
    },
};