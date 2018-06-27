'use strict';

const Controller = require('egg').Controller;
const _ = require("lodash");

class selQuotController extends Controller {
    async addQuot() {
        const { ctx, service, app } = this;
        ctx.helper.pre("addQuot", {
            ver: { type: 'string' },
            source: { type: 'string' },
            uid: { type: 'string' },
            token: { type: 'string' },
            market: { type: 'string' },
            type: { type: 'string' }
        });
        if(ctx.arg.uid == '-1'){
          ctx.body = {
            code: -2,
            data: null,
            massage: "请重新登陆"
          };
        }else{
          let res = '';
          if(ctx.arg.type == "add"){
            res = await ctx.service.quot.addQuot();
            ctx.helper.end("addQuot");
          }else{
            res = await ctx.service.quot.delQuot();
            ctx.helper.end("delQuot");
          }
          ctx.body = res;
        }
    }

    async delQuot() {
      const { ctx, service, app } = this;
      ctx.helper.pre("delQuot", {
          ver: { type: 'string' },
          source: { type: 'string' },
          uid: { type: 'string' },
          token: { type: 'string' },
          market: { type: 'string' }
      });
      if(ctx.arg.uid == '-1'){
        ctx.body = {
          code: -2,
          data: null,
          massage: "请重新登陆"
        };
      }else{
        let res = await ctx.service.quot.delQuot();
        ctx.body = res;
      }
      ctx.helper.end("delQuot");
    }

    async isQuot() {
      const { ctx, service, app } = this;
      ctx.helper.pre("isQuot", {
          ver: { type: 'string' },
          source: { type: 'string' },
          uid: { type: 'string' },
          token: { type: 'string' },
          market: { type: 'string' }
      });
      if(ctx.arg.uid == '-1'){
        ctx.body = {
          code: -2,
          data: null,
          massage: "请重新登陆"
        };
      }else{
        let res = await ctx.service.quot.isQuot();
        ctx.body = res;
      }
      ctx.helper.end("isQuot");
    }

    async quotInfo() {
      const { ctx, service, app } = this;
      ctx.helper.pre("quotInfo", {
          ver: { type: 'string' },
          source: { type: 'string' },
          uid: { type: 'string' },
          token: { type: 'string' }
      });
      if(ctx.arg.uid == '-1'){
        ctx.body = {
          code: -2,
          data: null,
          massage: "请重新登陆"
        };
      }else{
        let res = await ctx.service.quot.quotInfo();
        ctx.body = res;
      }
      ctx.helper.end("quotInfo");
    }
}

module.exports = selQuotController;
