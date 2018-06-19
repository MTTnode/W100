'use strict';
const Service = require('egg').Service;
const otplib = require('otplib');

class RoleService extends Service {

  async usrLogin(param) {
    const {ctx, service, app} = this;
    let res = '';
    let data = await ctx.model.WeexUser.find({name: param.name, password: param.password});
    console.log('==============用户登陆=============');
    console.log(data);
    if(data.length > 0){
      res = {
        code: 0,
        data: data[0],
        message: "OK"
      };
    }else{
      res = {
        code: -1,
        data: null,
        message: "登陆失败"
      };
    }
    return res;
  }

  async addUser(params) {
    const {ctx, service, app} = this;
    let res = '';
    let data = await ctx.model.WeexUser.find({name: params.name});
    if(data.length > 0){
      res = {
        code: -1,
        data: null,
        message: "该用户已存在"
      };
    }else{
      let secret = otplib.authenticator.generateSecret();
      let token = otplib.authenticator.generate(secret);
      params.password = token;
      let msg = '';
      try {
        await ctx.model.WeexUser.create(params);
        msg = '添加成功';
      } catch (error) {
        console.log(error);
        msg = '添加失败';
      }
      res = {
        code: 0,
        data: msg,
        message: "OK"
      };
    }

    return res;
  }

  async userList() {
    const {ctx, service, app} = this;
    let res = '';
    let data = await ctx.model.WeexUser.find({});

    res = {
      code: 0,
      data: data,
      message: "OK"
    };

    return res;
  }

  async delUser(param) {
    const {ctx, service, app} = this;
    let res = '';
    let data = await ctx.model.WeexUser.find({name: param.name});
    if(data.length > 0){
      let item = await ctx.model.WeexUser.remove({name: param.name});
      res = {
        code: 0,
        data: item,
        message: "OK"
      };
    }else{
      res = {
        code: -1,
        data: null,
        message: "删除失败"
      };
    }
    return res;
  }

}

module.exports = RoleService; 