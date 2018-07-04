'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");
const moment = require("moment");
const utils = require('../../lib/utils.js');

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
    let params = ctx.request.body || {};
    if(!utils.regEmail.test(params.name)){
      ctx.body = {
        code: -1,
        message: '用户信息不合法！',
        data: null
      };
    }else{
      let res = await service.role.addUser(params);
      ctx.body = {
        code: 0,
        message: 'OK',
        data: res
      };
    }

    ctx.helper.end("addUser");
  }

  async resetUser() {
    const { ctx, service, app } = this;
    ctx.helper.pre("resetUser", {
      name: { type: 'string' },
      type: { type: 'string' }
    });
    
    let params = ctx.request.body || {};
    let res = await service.role.resetUser(params);
    ctx.body = {
      code: 0,
      message: 'OK',
      data: res
    };

    ctx.helper.end("resetUser");
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
