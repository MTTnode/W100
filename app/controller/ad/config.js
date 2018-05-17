'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class ConfigController extends Controller {
  /**
   * banner 列表
   * @return {Promise} [description]
   */
  async banner() {
    const {ctx, service, app} = this;
    ctx.body = await service.adminConfig.getBanner();
  }

  /**
   * 保存 banner
   * @return {Promise} [description]
   */
  async saveBanner() {
    const {ctx, service, app} = this;

    ctx.helper.pre("saveBanner", {
      imgurl: {
        type: 'string'
      }
    });

    let params = ctx.request.body || {};
    let result = await service.adminConfig.saveBanner(params);
    ctx.body = result;

    ctx.helper.end("saveBanner");
  }

  /**
   * 删除 banner
   * @return {Promise} [description]
   */
  async delBanner() {
    const {ctx, service, app} = this;
    const { _id } = ctx.request.body;

    let result = await service.adminConfig.delBanner(_id);

    ctx.body = result;

  }

  /**
   * transact 列表
   * @return {Promise} [description]
   */
  async transact() {
    const {ctx, service, app} = this;
    ctx.body = await service.adminConfig.getTransactr();
  }

  /**
   * 保存 transact
   * @return {Promise} [description]
   */
  async saveTransact() {
    const {ctx, service, app} = this;

    ctx.helper.pre("saveTransact", {
      base: {
        type: 'string'
      },
      markets: {
        type: 'string'
      }
    });

    let params = ctx.request.body || {};
    let result = await service.adminConfig.saveTransact(params);
    ctx.body = result;

    ctx.helper.end("saveTransact");
  }

  /**
   * 黑名单 列表
   * @return {Promise} [description]
   */
  // async blacklist() {
  //   const {ctx, service, app} = this;
  //   ctx.helper.pre("blacklist", {
  //     curPage: {
  //       type: 'number'
  //     }
  //   });
  //   const { curPage } = ctx.request.body;
  //   ctx.body = await service.adminConfig.getBlacklist(parseInt(curPage));
  // }

}

module.exports = ConfigController;
