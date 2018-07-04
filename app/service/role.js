'use strict';
const Service = require('egg').Service;
const otplib = require('otplib');
const CryptoJS = require('crypto-js');
const sendMail = require('../lib/mail.js');

class RoleService extends Service {

  async usrLogin(param) {
    const {ctx, service, app} = this;
    let res = '';
    let pwd = CryptoJS.AES.decrypt(param.password, 'weex').toString(CryptoJS.enc.Utf8);
    let data = await ctx.model.WeexUser.find({name: param.name});
    let pwd1 = CryptoJS.AES.decrypt(data[0].password, 'weex').toString(CryptoJS.enc.Utf8);
    if(data.length > 0 && (pwd == pwd1)){
      if(data[0].isLogin == 0){
        res = {
          code: -2,
          data: null,
          message: "初始化密码"
        };
      }else{
        res = {
          code: 0,
          data: data[0],
          message: "OK"
        };
      }
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
      let pwd = otplib.authenticator.generate(secret);
      //此时发送邮件
      let html = '';
      html += '尊敬的用户：<br>您的W100管理后台账号已经注册成功，账号为：'+ params.name +',密码：'+ pwd +'。<br>为了您的账号安全，登陆后请及时修改您的密码。<br><br><br>W100系统发件，请勿回复。';
      sendMail(params.name, 'W100管理后台账号注册', html, app);
      params.password = CryptoJS.AES.encrypt(pwd, 'weex').toString();
      params.isLogin = 0;
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

  async resetUser(params) {
    const {ctx, service, app} = this;
    let res = '';
    let data = await ctx.model.WeexUser.find({name: params.name});
    if(data.length > 0){
      let msg = '';
      if(params.type == "reset"){
        let secret = otplib.authenticator.generateSecret();
        let pwd = otplib.authenticator.generate(secret);
        //此时发送邮件
        let html = '';
        html += '尊敬的用户：<br>您的w100管理后台账号：'+ params.name +'的密码已重置,新密码：'+ pwd +'。<br>为了您的账号安全，登陆后请及时修改您的密码。<br><br><br>W100系统发件，请勿回复。';
        sendMail(params.name, 'W100管理后台账号密码重置', html, app);
        params.password = CryptoJS.AES.encrypt(pwd, 'weex').toString();
        try {
          await ctx.model.WeexUser.update({ name: params.name }, {
            $set: {
              password: params.password,
              isLogin: 0
            }
          });
          msg = '重置成功';
        } catch (error) {
          console.log(error);
          msg = '重置失败';
        }
      }else if(params.type == "setpwd"){
        params.password = params.password;
        params.name = params.name;
        try {
          await ctx.model.WeexUser.update({ name: params.name }, {
            $set: {
              password: params.password,
              isLogin: 1
            }
          });
          msg = '重置成功';
        } catch (error) {
          console.log(error);
          msg = '重置失败';
        }
      }else{
        return res = {
          code: -1,
          data: null,
          message: "操作错误"
        };
      }
    
      res = {
        code: 0,
        data: msg,
        message: "OK"
      };
    }else{
      res = {
        code: -1,
        data: null,
        message: "该用户不存在"
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