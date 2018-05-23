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
  async blacklist() {
    const {ctx, service, app} = this;
    ctx.helper.pre("blacklist", {
      curPage: {
        type: 'string'
      }
    });
    const curPage = ctx.query.curPage;
    ctx.body = await service.adminConfig.getBlacklist(parseInt(curPage));

    ctx.helper.end("blacklist");
  }

  /**
   * 黑名单 添加
   * @return {Promise} [description]
   */
  async addBlack() {
    const {ctx, service, app} = this;
    ctx.helper.pre("addBlack", {
      type: {
        type: 'string'
      },
      content: {
        type: 'string'
      }
    });
    let params = ctx.request.body || {};
    ctx.body = await service.adminConfig.addBlack(params);

    ctx.helper.end("addBlack");
  }

  /**
   * 删除 黑名单
   * @return {Promise} [description]
   */
  async delBlack() {
    const {ctx, service, app} = this;
    const { _id } = ctx.request.body;
    ctx.body = await service.adminConfig.delBlack(_id);
  }

  /**
   * 白名单 列表
   * @return {Promise} [description]
   */
  async whitelist() {
    const {ctx, service, app} = this;
    ctx.helper.pre("whitelist", {
      curPage: {
        type: 'string'
      }
    });
    const curPage = ctx.query.curPage;
    ctx.body = await service.adminConfig.getWhitelist(parseInt(curPage));

    ctx.helper.end("whitelist");
  }

  /**
   * 白名单 添加
   * @return {Promise} [description]
   */
  async addWhite() {
    const {ctx, service, app} = this;
    try {
      ctx.helper.pre("addWhite", {
        content: {
          type: 'string'
        }
      });
      let params = ctx.request.body || {};
      ctx.body = await service.adminConfig.addWhite(params);
    } catch (error) {
      ctx.body = {
        code: 422,
        data: '添加白名单需要填写描述！'
      }
    }

    ctx.helper.end("addWhite");
  }

  /**
   * 删除 白名单
   * @return {Promise} [description]
   */
  async delWhite() {
    const {ctx, service, app} = this;
    const { _id } = ctx.request.body;
    ctx.body = await service.adminConfig.delWhite(_id);
  }

}

module.exports = ConfigController;
