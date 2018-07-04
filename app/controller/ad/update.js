'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class UpdateController extends Controller {
    async checkList() {
        const { ctx, service, app } = this;
        ctx.helper.pre("checkList", {
        });

        ctx.body = await service.update.checkList();
        ctx.helper.end("checkList");
    }

    async addVaersion() {
      const { ctx, service, app } = this;
      ctx.helper.pre("addVaersion", {
        version: { type: 'string' },
        update_status: { type: 'string' },
        client: { type: 'string' },
        remark: { type: 'string' }
      });
      let params = ctx.request.body || {};
      ctx.body = await service.update.addVaersion(params);

      ctx.helper.end("addVaersion");
  }

}

module.exports = UpdateController;
