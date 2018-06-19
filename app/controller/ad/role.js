'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");
const moment = require("moment");

class RoleController extends Controller {

  async usrLogin() {
    const { ctx, service, app } = this;
    ctx.helper.pre("usrLogin", {
      name: { type: 'string' },
      password: { type: 'string' }
    });

    let params = ctx.request.body || {};
    let res = await service.role.usrLogin(params);
    ctx.body = res;

    ctx.helper.end("usrLogin");
  }

  async userList() {
      const { ctx, service, app } = this;
      ctx.helper.pre("userList", {
      });
      
      let res = await service.role.userList();
      ctx.body = res;

      ctx.helper.end("userList");
  }

  async addUser() {
    const { ctx, service, app } = this;
    ctx.helper.pre("addUser", {
      name: { type: 'string' },
      role: { type: 'number' }
    });
    console.log(typeof ctx.request.body.role);
    let params = ctx.request.body || {};
    let res = await service.role.addUser(params);
    ctx.body = {
      code: 0,
      message: 'OK',
      data: res
    };

    ctx.helper.end("addUser");
  }

  async delUser() {
    const { ctx, service, app } = this;
    ctx.helper.pre("delUser", {
      name: { type: 'string' }
    });
    
    let params = ctx.request.body || {};
    let res = await service.role.delUser(params);
    ctx.body = res;

    ctx.helper.end("delUser");
  }

}

module.exports = RoleController;
