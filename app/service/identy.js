'use strict';
const Service = require('egg').Service;

class IdentyService extends Service {
  async saveIdenty() {
    const {ctx, service, app} = this;

    let params = ctx.request.body || {};

    params.uid = ctx.arg.uid;
    params.status = "0";  //默认审核中
    let res = {};
    try {
      let json = await ctx.model.Identy.find({"uid": ctx.arg.uid});
      if(json.length > 0){
        res.data = null;
        res.code = -1;
        res.message = "提交失败";
      }else{
        let data = await ctx.model.Identy.create(params);
        res.data = data;
        res.code = 0;
        res.message = "OK";
      }
    } catch (error) {
      res.data = null;
      res.code = -1;
      res.message = "提交失败";
    }
    return res;
  }

  async getIdenty() {
    const {ctx, service, app} = this;

    let params = {};
    params.uid = ctx.arg.uid;
    let data = await ctx.model.Identy.find(params);
    let res = {};
    if(data.length > 0){
      res.data = data;
      res.code = 0;
      res.message = "OK";
    }else{
      res.data = null;
      res.code = -1;
      res.message = "未审核";
    }
      
    return res;
  }

  async getIdentyList() {
    const {ctx, service, app} = this;

    let params = {};
    if(ctx.query.uid){
      params.uid = ctx.query.uid;
    }
    if(ctx.query.type){
      params.type = ctx.query.type;
    }
    let curPage = parseInt(ctx.query.curPage);

    let data = await ctx.model.Identy.find(params);
    let json = await ctx.model.Identy.find(params).limit(10).skip(curPage*10);
    let item = {};
    item.total = data.length;
    item.list = json;
    
    let res = {
      code: 0,
      message: "OK"
    };
    res.data = item;
      
    return res;
  }

  async setIdenty() {
    const {ctx, service, app} = this;

    let params = ctx.request.body || {};
    let data = await ctx.model.Identy.find({uid: params.uid, _id: params._id});
    let res = {};
    if(data.length > 0){
      try {
        if(params.passBtn == '1'){
          params.status = "1";
          let json = await ctx.model.Identy.update({uid: params.uid, _id: params._id}, {
            $set: {
              status: params.status
            }
          });
          res.code = 0;
          res.message = "OK";
          res.data = json;
        }else if(params.passBtn == '2'){
          params.status = "2";
          let json = await ctx.model.Identy.update({uid: params.uid, _id: params._id}, {
            $set: {
              status: params.status,
              info: params.info
            }
          });
          res.code = 0;
          res.message = "OK";
          res.data = json;
        }else{
          res.data = null;
          res.code = -1;
          res.message = "审核失败";
        }
      } catch (error) {
        res.data = null;
        res.code = -1;
        res.message = "审核失败";
        console.log(error);
      }
    }else{
      res.data = null;
      res.code = -1;
      res.message = "审核失败";
    }

    return res;
  }

}

module.exports = IdentyService;
