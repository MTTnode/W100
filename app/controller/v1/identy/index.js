'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class IdentyController extends Controller {
    /**
     * 认证
     */
    async usrIdenty() {
        const { ctx, service, app } = this;

        let params = ctx.request.body || {};
        if(params.type == "1"){
          //企业认证
          ctx.helper.pre("usrIdenty", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            name: { type: 'string' },
            representatrive: { type: 'string' },
            beneficial_name: { type: 'string' },
            addr: { type: 'string' },
            contact: { type: 'string' },
            funds: { type: 'string' },
            nature: { type: 'string' },
            sign: { type: 'string' },
          });
        }else if(params.type == "0"){
          //个人认证
          ctx.helper.pre("usrIdenty", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            name: { type: 'string' },
            birthday: { type: 'string' },
            place: { type: 'string' },  //永久居住地
            addr: { type: 'string' },
            contact: { type: 'string' },
            nationality: { type: 'string' },
            identy_number: { type: 'string' },
            funds: { type: 'string' },
            nature: { type: 'string' },
          });
        }else{
          return ctx.body = {
            code: -2,
            data: null,
            message: "认证信息不合法！"
          };
        }    
        let result = await ctx.service.identy.saveIdenty();

        ctx.body = result;
        ctx.helper.end("usrIdenty");
    }

    /**
     * 查询认证状态
     */
    async getIdenty() {
      const { ctx, service, app } = this;
      
      ctx.helper.pre("getIdenty", {
        ver: { type: 'string' },
        source: { type: 'string' },
        uid: { type: 'string' },
        token: { type: 'string' }
      });

      let result = await ctx.service.identy.getIdenty();

      ctx.body = result;
      ctx.helper.end("getIdenty");
  }

  /**
   * 查询认证信息
   */
  async getIdentyList() {
    const { ctx, service, app } = this;

    let result = await ctx.service.identy.getIdentyList();

    ctx.body = result;
  }

  /**
   * 修改认证状态
   */
  async setIdenty() {
    const { ctx, service, app } = this;

    ctx.helper.pre("setIdenty", {
      uid: { type: 'string' },
      passBtn: { type: 'string' },
      _id: { type: 'string' }
    });

    let result = await ctx.service.identy.setIdenty();

    ctx.body = result;
  }

}

module.exports = IdentyController;
