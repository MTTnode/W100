'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/w100/',  controller.home.index);
  router.get('/w100/v1/user/asset',  controller.v1.user.user.asset);//获取用户资产
  router.post('/w100/v1/stat', controller.v1.stat.stat.stat);//统计数据上报
  router.get('/w100/v1/quot/ranking',  controller.v1.price.index.ranking); //获取涨跌排行榜
  router.get('/w100/v1/transaction/getMarkets', controller.v1.transaction.index.getMarkets);//获取所有交易对
  router.get('/w100/v1/aid/config/getCurrency', controller.v1.aid.config.getCurrency);//获取所有币种
  router.get('/w100/v1/aid/config/banner',  controller.v1.aid.config.banner);//banner公告
  router.get('/w100/v1/aid/exchage/quot', controller.v1.aid.exchange.quot);//获取其他交易所数据
  router.get('/w100/v1/aid/exchage/quots', controller.v1.aid.exchange.quots);//获取其他交易所数据
  router.post('/w100/v1/payment/recharge', controller.v1.payment.index.recharge);//充值
  router.post('/w100/v1/payment/callback', controller.v1.payment.index.callback);//回调
  router.get('/w100/v1/payment/getOrderStatus', controller.v1.payment.index.getOrderStatus);//获取订单状态
  router.post('/w100/v1/payment/setOrderStatus', controller.v1.payment.index.setOrderStatus);//获取订单状态
  router.post('/w100/v1/payment/dora_generate_orders', controller.v1.payment.dora.generateOrders);//dora生成订单
  router.post('/w100/v1/payment/dora_callback', controller.v1.payment.dora.callback);//回调
  router.get('/w100/v1/payment/dora_orders_list', controller.v1.payment.dora.getOrdersList);//获取用户单列表
  router.post('/w100/v1/payment/dora/withdraw', controller.v1.payment.dora.withdraw);//用户请求提现
  router.get('/w100/v1/payment/dora/withdraw_list', controller.v1.payment.dora.withdrawList);//用户请求提现列表
  router.post('/w100/v1/payment/dora/callback_withdraw', controller.v1.payment.dora.callback_withdraw);//平台回调确认和通知
  router.post('/w100/v1/payment/dora/review_withdraw', controller.v1.payment.dora.review_withdraw);//Admin对提现订单的处理

  router.get('/w100/v1/payment/getOrderList', controller.v1.payment.index.getOrderList);//获取订单状态
  router.get('/w100/v1/payment/dora_trading_info', controller.v1.payment.dora.getTradingInfo);//获取充值手续费费率
  router.get('/w100/v1/client/update/check',  controller.v1.client.update.check.checkVer);//app版本检查
  router.post('/w100/v1/marketwarn/addMarketwarn', controller.v1.marketwarn.index.addMarketwarn);//新增预警
  router.post('/w100/v1/marketwarn/delMarketwarn', controller.v1.marketwarn.index.delMarketwarn);//删除预警
  router.get('/w100/v1/marketwarn/getMarketwarn', controller.v1.marketwarn.index.getMarketwarn);//查看预警
  router.get('/w100/v1/marketwarn/getMarketwarnList', controller.v1.marketwarn.index.getMarketwarnList);//查看预警列表

  // router.post('/w100/v1/payment/blc/depositApply', controller.v1.payment.blc.depositApply);//BLC生成订单
  // router.get('/w100/v1/payment/blc/orders_list', controller.v1.payment.blc.getOrdersList);//获取用户单列表
  // router.get('/w100/v1/payment/blc/trading_info', controller.v1.payment.blc.getTradingInfo);//获取充值手续费费率、银行列表
  // router.post('/w100/v1/payment/blc/addTransfer', controller.v1.payment.blc.addTransfer);//回调
  // router.post('/w100/v1/payment/blc/exceptionWithdrawApply', controller.v1.payment.blc.exceptionWithdrawApply);//回调
  // router.post('/w100/v1/payment/blc/withdrawalResult', controller.v1.payment.blc.withdrawalResult);//回调


  //////后台接口
  router.get('/ad/stat', controller.ad.statistics.index); //后台管理统计
  router.get('/ad/banner', controller.ad.config.banner);  //banner配置
  router.post('/ad/saveBanner', controller.ad.config.saveBanner);  //banner保存
  router.post('/ad/delBanner', controller.ad.config.delBanner);  //banner删除
  router.get('/ad/transact', controller.ad.config.transact);  //交易对配置
  router.post('/ad/saveTransact', controller.ad.config.saveTransact);  //交易对保存
  router.get('/ad/blacklist', controller.ad.config.blacklist); //黑名单列表
  router.post('/ad/addBlack', controller.ad.config.addBlack); //黑名单添加
  router.post('/ad/delBlack', controller.ad.config.delBlack); //黑名单删除
  router.get('/ad/whitelist', controller.ad.config.whitelist); //白名单列表
  router.post('/ad/addWhite', controller.ad.config.addWhite); //白名单添加
  router.post('/ad/delWhite', controller.ad.config.delWhite); //白名单删除
  router.get('/ad/getDAU', controller.ad.statistics.getDAU); //后台管理统计
  router.get('/ad/update/checkList',  controller.ad.update.checkList);//app版本列表
  router.post('/ad/update/addVersion',  controller.ad.update.addVaersion);//添加app版本
  router.get('/ad/order/orderList',  controller.ad.order.orderList);//app版本列表
  router.get('/ad/role/userList',  controller.ad.role.userList);//后台用户列表
  router.post('/ad/role/addUser',  controller.ad.role.addUser);//添加后台用户
  router.post('/ad/role/delUser',  controller.ad.role.delUser);//删除后台用户
  router.post('/ad/role/usrLogin',  controller.ad.role.usrLogin);//删除后台用户
  router.get('/ad/order/payment_orderList',  controller.ad.paymentorder.orderList);//获取dora支付的列表

  router.get('*', async (ctx, next) => {
    ctx.service.httpDefend.addHttp(ctx, 404);
    ctx.body = { status : 404, message: 'Not Found' };
  });
  router.post('*', async (ctx, next) => {
    ctx.service.httpDefend.addHttp(ctx, 404);
    ctx.body = { status : 404, message: 'Not Found' };
  });
};
